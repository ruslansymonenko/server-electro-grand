import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { Prisma, Product, Subcategory } from '@prisma/client';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { createSlug } from '../utils/create-slug/create-slug';
import { EnumFoldersNames, FilesService, IFileResponse } from '../files/files.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BrandService } from '../brand/brand.service';

interface IProductService {
  create(dto: ProductDto): Promise<Product | null>;
  setProductImages(id: number, images: Express.Multer.File[]): Promise<Product | null>;
  getAll(searchParams?: any): Promise<Product[] | null>;
  getById(id: number): Promise<Product | null>;
  getByBrand(brandId: number): Promise<Product[] | null>;
  getByCategory(categoryId: number): Promise<Product[] | null>;
  getBySubcategory(subcategoryId: number): Promise<Product[] | null>;
  getBySlug(slug: string): Promise<Product | null>;
  update(id: number, dto: UpdateProductDto): Promise<Product | null>;
  delete(id: number): Promise<Product | null>;
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
      });

      if (!updatedProduct) throw new InternalServerErrorException('Error updating product images');

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Product[] | null> {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!products) throw new InternalServerErrorException('Products was not found');

      return products;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get products', error.message);
    }
  }

  async getByBrand(brandId: number): Promise<Product[] | null> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          brandId: brandId,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!products) throw new NotFoundException('Error getting products');

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByCategory(categoryId: number): Promise<Product[] | null> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          categoryId: categoryId,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!products) throw new NotFoundException('Error getting products');

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySubcategory(subcategoryId: number): Promise<Product[] | null> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          subcategoryId: subcategoryId,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!products) throw new NotFoundException('Error getting products');

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!product) throw new NotFoundException('Error getting product');

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          slug: slug,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
        },
      });

      if (!product) throw new NotFoundException('Error getting product');

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    try {
      const isProduct = await this.getById(id);

      if (!isProduct) throw new BadRequestException('Product not found');

      const updateData: Prisma.ProductUpdateInput = {};

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
      });

      if (!updatedProduct)
        throw new InternalServerErrorException('Error while updating' + ' product');

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update product: ${error}`);
    }
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
        await Promise.all(
          oldImagesPaths.map(async (imagePath) => {
            const fullPath = path.join(__dirname, '..', '..', imagePath);
            await fs.unlink(fullPath);
          }),
        );
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product', error.message);
    }
  }
}
