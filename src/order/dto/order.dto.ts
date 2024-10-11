import { EnumOrderStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { OrderItemDto } from '../../order-item/dto/order-item.dto';
import { Type } from 'class-transformer';

const availableStatuses: string[] = Object.values(EnumOrderStatus);

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Status should be on of ${availableStatuses.map((value) => `${value}`).join(', ')}`,
  })
  status: EnumOrderStatus;

  @IsOptional()
  @IsNumber({}, { message: 'User id should be a number' })
  userId: number;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Status should be on of ${availableStatuses.map((value) => `${value}`).join(', ')}`,
  })
  status: EnumOrderStatus;

  @IsOptional()
  @IsNumber({}, { message: 'User id should be a number' })
  userId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
