import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, FilesService],
  exports: [CategoryService],
})
export class CategoryModule {}
