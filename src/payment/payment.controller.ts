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
import { PaymentService } from './payment.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { PaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('')
  async create(@Body() dto: PaymentDto) {
    return this.paymentService.create(dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.paymentService.getAll(searchParams);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.paymentService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-orderId/:id')
  async getByOrderId(@Param('id') id: string) {
    return this.paymentService.getByOrderId(parseInt(id));
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Get('by-userId/:id')
  async getByUserId(@Param('id') id: string) {
    return this.paymentService.getByUserId(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.paymentService.delete(parseInt(id));
  }
}
