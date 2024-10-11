import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { BrandService } from '../brand/brand.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    CategoryService,
    SubcategoryService,
    BrandService,
    FilesService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
