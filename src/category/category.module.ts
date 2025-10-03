import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, FilesService],
  exports: [CategoryService],
})
export class CategoryModule {}
