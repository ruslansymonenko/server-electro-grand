import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { OrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Post('')
  async create(@Body() dto: OrderItemDto) {
    return this.orderItemService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.orderItemService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN || EnumUserRoles.CUSTOMER)
  @Get('by-orderId/:id')
  async getByOrderId(@Param('id') id: string) {
    return this.orderItemService.getByOrderId(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.orderItemService.delete(parseInt(id));
  }
}
