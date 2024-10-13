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
import { BrandService } from './brand.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { BrandDto, UpdateBrandDto } from './dto/brand.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: BrandDto) {
    return this.brandService.create(dto);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('set-image/:id')
  async setProductImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.brandService.setBrandImage(parseInt(id), files);
  }

  @HttpCode(200)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.brandService.getAll(searchParams);
  }

  @HttpCode(200)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.brandService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.brandService.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.brandService.delete(parseInt(id));
  }
}
