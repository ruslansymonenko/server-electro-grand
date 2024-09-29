import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService, PrismaService, CategoryService],
})
export class SubcategoryModule {}
