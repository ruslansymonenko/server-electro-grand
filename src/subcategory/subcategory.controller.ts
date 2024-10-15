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
import { SubcategoryService } from './subcategory.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { SubcategoryDto, UpdateSubcategoryDto } from './dto/subcategory.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: SubcategoryDto) {
    return this.subcategoryService.create(dto);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('set-image/:id')
  async setProductImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    console.log('text');
    return this.subcategoryService.setSubcategoryImage(parseInt(id), files);
  }

  @HttpCode(200)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.subcategoryService.getAll(searchParams);
  }

  @HttpCode(200)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.subcategoryService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.subcategoryService.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.subcategoryService.delete(parseInt(id));
  }
}
