import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { PrismaService } from '../prisma.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, PrismaService, FilesService],
  exports: [BrandService],
})
export class BrandModule {}
