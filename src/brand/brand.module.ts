import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, FilesService],
  exports: [BrandService],
})
export class BrandModule {}
