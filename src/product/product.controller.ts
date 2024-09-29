import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { ProductDto } from './dto/product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  // @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: ProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productService.create(dto, files);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('set-images/:id')
  async setProductImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productService.setProductImages(parseInt(id), files);
  }
}
