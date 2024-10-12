import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('set-images/:id')
  async setProductImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productService.setProductImages(parseInt(id), files);
  }

  @HttpCode(200)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.productService.getAll(searchParams);
  }

  @HttpCode(200)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-brand/:id')
  async getByBrandId(@Param('id') id: string) {
    return this.productService.getByBrand(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-category/:id')
  async getByCategoryId(@Param('id') id: string) {
    return this.productService.getByCategory(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-subcategory/:id')
  async getBySubcategoryId(@Param('id') id: string) {
    return this.productService.getBySubcategory(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(parseInt(id));
  }
}
