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
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('')
  async create(@Body() dto: OrderDto) {
    return this.orderService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.orderService.getAll(searchParams);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.orderService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-userId/:id')
  async getByUserId(@Param('id') id: string) {
    return this.orderService.getByUserId(parseInt(id));
  }

  @HttpCode(200)
  @Auth()
  @Get('by-user-orders')
  async getUserOwnOrder(@CurrentUser('id') userId: number) {
    return this.orderService.getByUserId(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.orderService.delete(parseInt(id));
  }
}
