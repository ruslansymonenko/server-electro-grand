import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CategoryService, SubcategoryService, FilesService],
})
export class ProductModule {}
