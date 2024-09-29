import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { Product } from '@prisma/client';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { createSlug } from '../utils/create-slug/create-slug';
import { EnumFoldersNames, FilesService, IFileResponse } from '../files/files.service';
import * as fs from 'fs/promises';
import * as path from 'path';

interface IProductService {
  create(dto: ProductDto): Promise<Product | null>;
  getAll(searchParams?: any): Promise<Product[] | null>;
  getById(id: number): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  update(id: number, dto: UpdateProductDto): Promise<Product | null>;
}

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private filesService: FilesService,
  ) {}

  async create(dto: ProductDto, images: Express.Multer.File[]): Promise<Product | null> {
    try {
      const isCategory = await this.categoryService.getById(dto.categoryId);

      if (!isCategory) throw new BadRequestException('Category not found');

      const isSubcategory = await this.subcategoryService.getById(dto.subcategoryId);

      if (!isSubcategory) throw new BadRequestException('Subcategory not found');

      const productSlug: string = createSlug(dto.name);

      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          slug: productSlug,
          description: dto.description ? dto.description : dto.name,
          price: dto.price,
          categoryId: dto.categoryId,
          subcategoryId: dto.subcategoryId,
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
      // if (images.length <= 0) throw new BadRequestException('Images not found');

      const currentProduct = await this.prisma.product.findUnique({
        where: { id: id },
        select: { images: true },
      });

      if (!currentProduct) throw new NotFoundException('Product not found');

      const oldImagesPaths = currentProduct.images;
      if (oldImagesPaths.length > 0) {
        await Promise.all(
          oldImagesPaths.map(async (imagePath) => {
            const fullPath = path.join(__dirname, '..', '..', imagePath);
            await fs.unlink(fullPath);
          }),
        );
      }

      const filesData: IFileResponse[] = await this.filesService.saveFiles(
        images,
        EnumFoldersNames.PRODUCTS,
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
}
