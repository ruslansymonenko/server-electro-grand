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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import {
  AttributeValueDto,
  UpdateAttributeValueDto,
} from '../attribute-value/dto/attribute-value.dto';
import { ProductAttributeDto, UpdateProductAttributeDto } from './dto/product-attribute.dto';

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(private readonly productAttributeService: ProductAttributeService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: ProductAttributeDto) {
    return this.productAttributeService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-product-id/:id')
  async getById(@Param('id') id: string) {
    return this.productAttributeService.getByProductId(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductAttributeDto) {
    return this.productAttributeService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.productAttributeService.delete(parseInt(id));
  }
}
