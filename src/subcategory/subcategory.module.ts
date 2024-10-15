import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService, PrismaService, CategoryService, FilesService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
