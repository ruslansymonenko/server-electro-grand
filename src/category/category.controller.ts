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
import { CategoryService } from './category.service';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('set-image/:id')
  async setProductImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    console.log('text');
    return this.categoryService.setCategoryImage(parseInt(id), files);
  }

  @HttpCode(200)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.categoryService.getAll(searchParams);
  }

  @HttpCode(200)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(parseInt(id));
  }
}
