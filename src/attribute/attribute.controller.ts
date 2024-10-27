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
import { AttributeService } from './attribute.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { AttributeDto, UpdateAttributeDto } from './dto/attribute.dto';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: AttributeDto) {
    return this.attributeService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.attributeService.getAll(searchParams);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.attributeService.getById(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributeService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.attributeService.delete(parseInt(id));
  }
}
