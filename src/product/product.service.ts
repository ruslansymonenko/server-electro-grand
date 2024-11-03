import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { Prisma, Product } from '@prisma/client';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { createSlug } from '../utils/create-slug/create-slug';
import { EnumFoldersNames, FilesService, IFileResponse } from '../files/files.service';
import { BrandService } from '../brand/brand.service';

interface IProductService {
  create(dto: ProductDto): Promise<Product | null>;
  setProductImages(id: number, images: Express.Multer.File[]): Promise<Product | null>;
  getAll(searchParams?: any): Promise<IProductServiceResponse | null>;
  getById(id: number): Promise<Product | null>;
  getByBrand(brandSlug: string): Promise<IProductServiceResponse | null>;
  getByCategory(categorySlug: string): Promise<IProductServiceResponse | null>;
  getBySubcategory(subcategorySlug: string): Promise<IProductServiceResponse | null>;
  getBySlug(slug: string): Promise<Product | null>;
  update(id: number, dto: UpdateProductDto): Promise<Product | null>;
  delete(id: number): Promise<Product | null>;
}

export interface IProductWithSimilar extends Product {
  similarProducts: Product[];
}

export interface IProductServiceResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private brandService: BrandService,
    private filesService: FilesService,
  ) {}

  async create(dto: ProductDto): Promise<Product | null> {
    try {
      const isCategory = await this.categoryService.getById(dto.categoryId);
      if (!isCategory) throw new BadRequestException('Category not found');

      const isSubcategory = await this.subcategoryService.getById(dto.subcategoryId);
      if (!isSubcategory) throw new BadRequestException('Subcategory not found');

      if (dto.brandId) {
        const isBrand = await this.brandService.getById(dto.brandId);
        if (!isBrand) throw new BadRequestException('BrandId not found');
      }

      if (dto.categoryId && dto.subcategoryId) {
        const isSubcategoryInCategory: boolean =
          await this.subcategoryService.checkSubcategoryInCategory(
            dto.subcategoryId,
            dto.categoryId,
          );

        if (!isSubcategoryInCategory)
          throw new BadRequestException('Subcategory is not linked' + ' with category');
      }

      const productSlug: string = createSlug(dto.name);

      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          slug: productSlug,
          description: dto.description ? dto.description : dto.name,
          price: dto.price,
          categoryId: dto.categoryId,
          subcategoryId: dto.subcategoryId,
          brandId: dto.brandId ? dto.brandId : null,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
          productAttribute: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      });

      if (!product) throw new InternalServerErrorException('Error creating product');

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setProductImages(id: number, images: Express.Multer.File[]): Promise<Product | null> {
    try {
      const currentProduct = await this.prisma.product.findUnique({
        where: { id: id },
        select: { images: true },
      });

      if (!currentProduct) throw new NotFoundException('Product not found');

      const oldImagesPaths = currentProduct.images;

      const filesData: IFileResponse[] = await this.filesService.saveFiles(
        images,
        EnumFoldersNames.PRODUCTS,
        oldImagesPaths.length > 0 ? oldImagesPaths : null,
      );
      const imagesPaths: string[] = filesData.map((file) => file.url);

      const updatedProduct = await this.prisma.product.update({
        where: {
          id: id,
        },
        data: {
          images: imagesPaths,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!updatedProduct) throw new InternalServerErrorException('Error updating product images');

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<IProductServiceResponse | null> {
    console.log(searchParams);
    try {
      const filters = this.getFiltersObject(searchParams);

      const { skip, take, page, pageSize } = this.getPagination(searchParams);

      const products = await this.prisma.product.findMany({
        where: filters,
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
        skip,
        take,
      });

      const totalProducts: number = await this.prisma.product.count({ where: filters });

      if (!products) throw new InternalServerErrorException('Products was not found');

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
        currentPage: page,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get products', error.message);
    }
  }

  async getByBrand(brandSlug: string, searchParams?: any): Promise<IProductServiceResponse | null> {
    try {
      const { skip, take } = this.getPagination(searchParams);

      const products = await this.prisma.product.findMany({
        where: {
          brand: {
            slug: brandSlug,
          },
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
        skip,
        take,
      });

      const totalProducts = await this.prisma.product.count({
        where: {
          brand: {
            slug: brandSlug,
          },
        },
      });

      if (!products || products.length === 0) throw new NotFoundException('Error getting products');

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / take),
        currentPage: searchParams?.page ? Number(searchParams.page) : 1,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByCategory(
    categorySlug: string,
    searchParams?: any,
  ): Promise<IProductServiceResponse | null> {
    try {
      const { skip, take } = this.getPagination(searchParams);

      const products = await this.prisma.product.findMany({
        where: {
          category: {
            slug: categorySlug,
          },
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
        skip,
        take,
      });

      const totalProducts = await this.prisma.product.count({
        where: {
          category: {
            slug: categorySlug,
          },
        },
      });

      if (!products) throw new NotFoundException('Error getting products');

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / take),
        currentPage: searchParams?.page ? Number(searchParams.page) : 1,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySubcategory(
    subcategorySlug: string,
    searchParams?: any,
  ): Promise<IProductServiceResponse | null> {
    try {
      const { skip, take } = this.getPagination(searchParams);

      const products = await this.prisma.product.findMany({
        where: {
          subcategory: {
            slug: subcategorySlug,
          },
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
        skip,
        take,
      });

      const totalProducts = await this.prisma.product.count({
        where: {
          subcategory: {
            slug: subcategorySlug,
          },
        },
      });

      if (!products) throw new NotFoundException('Error getting products');

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / take),
        currentPage: searchParams?.page ? Number(searchParams.page) : 1,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: number): Promise<IProductWithSimilar | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
          productAttribute: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      });

      if (!product) throw new NotFoundException('Error getting product');

      const similarProducts = await this.getSimilarProducts(product.subcategoryId, product.id);

      return { ...product, similarProducts };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getSimilarProducts(subcategoryId: number, excludeProductId: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        subcategoryId,
        id: { not: excludeProductId },
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }

  async getBySlug(slug: string): Promise<IProductWithSimilar | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          slug: slug,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
          productAttribute: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      });

      if (!product) throw new NotFoundException('Error getting product');

      const similarProducts = await this.getSimilarProducts(product.subcategoryId, product.id);

      return { ...product, similarProducts };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    try {
      const isProduct = await this.getById(id);

      if (!isProduct) throw new BadRequestException('Product not found');

      const updateData: Prisma.ProductUpdateInput = {};

      if (dto.categoryId && !dto.subcategoryId) {
        throw new BadRequestException('With changing category, subcategory should be changed also');
      }

      if (dto.categoryId && dto.subcategoryId) {
        const isSubcategoryInCategory: boolean =
          await this.subcategoryService.checkSubcategoryInCategory(
            dto.subcategoryId,
            dto.categoryId,
          );

        if (!isSubcategoryInCategory)
          throw new BadRequestException('Subcategory is not linked' + ' with category');
      }

      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = createSlug(dto.name);
      }

      if (dto.description !== undefined) {
        updateData.description = dto.description;
      }

      if (dto.price !== undefined) {
        updateData.price = dto.price;
      }

      if (dto.categoryId !== undefined) {
        updateData.category = {
          connect: { id: dto.categoryId },
        };
      }

      if (dto.subcategoryId !== undefined) {
        updateData.subcategory = {
          connect: { id: dto.subcategoryId },
        };
      }

      if (dto.brandId !== undefined) {
        updateData.brand = {
          connect: { id: dto.brandId },
        };
      }

      const updatedProduct = await this.prisma.product.update({
        where: {
          id: id,
        },
        data: updateData,
        include: {
          category: true,
          subcategory: true,
          brand: true,
          productAttribute: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      });

      if (!updatedProduct)
        throw new InternalServerErrorException('Error while updating' + ' product');

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update product: ${error}`);
    }
  }

  getFiltersObject(searchParams: any) {
    const filters: any = {};

    if (searchParams.minPrice) {
      filters.price = { gte: Number(searchParams.minPrice) };
    }
    if (searchParams.maxPrice) {
      filters.price = { ...filters.price, lte: Number(searchParams.maxPrice) };
    }
    if (searchParams.category) {
      filters.category = { name: searchParams.category };
    }
    if (searchParams.subcategory) {
      filters.subcategory = { name: searchParams.subcategory };
    }
    if (searchParams.brand) {
      filters.brand = { name: searchParams.brand };
    }

    return filters;
  }

  getPagination(searchParams?: any) {
    const page: number = searchParams?.page
      ? Number(searchParams.page)
      : searchParams?.currentPage
        ? Number(searchParams.currentPage)
        : 1;
    const pageSize: number = searchParams?.pageSize ? Number(searchParams.pageSize) : 10;

    const skip: number = (page - 1) * pageSize;
    const take: number = pageSize;

    return { skip, take, page, pageSize };
  }

  async delete(id: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.delete({
        where: {
          id: id,
        },
      });

      if (!product) throw new InternalServerErrorException('Error deleting product');

      const oldImagesPaths = product.images;
      if (oldImagesPaths.length > 0) {
        await this.filesService.removeOldImages(oldImagesPaths);
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product', error.message);
    }
  }
}
