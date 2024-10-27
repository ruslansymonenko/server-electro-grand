import { IsNumber, IsOptional } from 'class-validator';

export class TypeOrderItem {
  @IsNumber({}, { message: 'Product id should be a number' })
  productId: number;

  @IsNumber({}, { message: 'Quantity should be a number' })
  quantity: number;
}

export class OrderItemDto {
  @IsOptional()
  @IsNumber({}, { message: 'Order id should be a number' })
  orderId: number;

  @IsNumber({}, { message: 'Quantity should be a number' })
  quantity: number;

  @IsNumber({}, { message: 'Product ID should be a number' })
  productId: number;
}

export class UpdateOrderItemDto {
  @IsOptional()
  @IsNumber({}, { message: 'Order id should be a number' })
  orderId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity should be a number' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'Price should be a number' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Product ID should be a number' })
  productId: number;
}
