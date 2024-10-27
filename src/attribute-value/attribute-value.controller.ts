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
import { AttributeValueService } from './attribute-value.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { AttributeValueDto, UpdateAttributeValueDto } from './dto/attribute-value.dto';

@Controller('attribute-value')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: AttributeValueDto) {
    return this.attributeValueService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.attributeValueService.getAll(searchParams);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.attributeValueService.getById(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateAttributeValueDto) {
    return this.attributeValueService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.attributeValueService.delete(parseInt(id));
  }
}
