import { EnumDeliveryType, EnumOrderStatus } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeOrderItem } from '../../order-item/dto/order-item.dto';

const availableStatuses: string[] = Object.values(EnumOrderStatus);
const availableDeliveryTypes: string[] = Object.values(EnumDeliveryType);

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Status should be on of ${availableStatuses.map((value) => `${value}`).join(', ')}`,
  })
  status: EnumOrderStatus;

  @IsOptional()
  @IsNumber({}, { message: 'User id should be a number' })
  userId: number;

  @ArrayNotEmpty({ message: 'Order items should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => TypeOrderItem)
  orderItems: TypeOrderItem[];

  @IsString({ message: 'Customer email should be a string' })
  customerEmail: string;

  @IsString({ message: 'Customer phone should be a string' })
  customerPhone: string;

  @IsOptional()
  @IsEnum(EnumDeliveryType, {
    message: `Status should be on of ${availableDeliveryTypes.map((value) => `${value}`).join(', ')}`,
  })
  deliveryType: EnumDeliveryType;

  @IsString({ message: 'Delivery address should be a string' })
  deliveryAddress: string;

  @IsOptional()
  @IsString({ message: 'Comments should be a string' })
  comments: string;
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
  @ArrayNotEmpty({ message: 'Order items should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => TypeOrderItem)
  orderItems: TypeOrderItem[];

  @IsOptional()
  @IsString({ message: 'Customer email should be a string' })
  customerEmail: string;

  @IsOptional()
  @IsString({ message: 'Customer phone should be a string' })
  customerPhone: string;

  @IsOptional()
  @IsEnum(EnumDeliveryType, {
    message: `Status should be on of ${availableDeliveryTypes.map((value) => `${value}`).join(', ')}`,
  })
  deliveryType: EnumDeliveryType;

  @IsOptional()
  @IsString({ message: 'Delivery address should be a string' })
  deliveryAddress: string;

  @IsOptional()
  @IsString({ message: 'Comments should be a string' })
  comments: string;
}
