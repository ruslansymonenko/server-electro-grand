import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { CategoryService } from '../category/category.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService, CategoryService, FilesService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
