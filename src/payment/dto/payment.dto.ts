import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EnumPaymentStatus } from '@prisma/client';

export class PaymentDto {
  @IsOptional()
  @IsNotEmpty({ message: 'User id is required' })
  @IsNumber({}, { message: 'User id should be a number' })
  userId: number;

  @IsNotEmpty({ message: 'Order id is required' })
  @IsNumber({}, { message: 'Order id should be a number' })
  orderId: number;

  @IsNotEmpty({ message: 'Payment amount is required' })
  @IsNumber({}, { message: 'Payment amount should be a number' })
  amount: number;

  @IsOptional()
  @IsEnum(EnumPaymentStatus, { message: 'Payment status is required' })
  status: EnumPaymentStatus;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNotEmpty({ message: 'User id is required' })
  @IsNumber({}, { message: 'User id should be a number' })
  userId: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Order id is required' })
  @IsNumber({}, { message: 'Order id should be a number' })
  orderId: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Payment amount is required' })
  @IsNumber({}, { message: 'Payment amount should be a number' })
  amount: number;

  @IsOptional()
  @IsEnum(EnumPaymentStatus, { message: 'Payment status is empty or has wrong value' })
  status: EnumPaymentStatus;
}
