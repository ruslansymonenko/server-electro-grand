import { IsNumber, IsOptional } from 'class-validator';

export class ProductAttributeDto {
  @IsNumber({}, { message: 'Product ID is required' })
  productId: number;

  @IsNumber({}, { message: 'Attribute ID is required' })
  attributeValueId: number;
}

export class UpdateProductAttributeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Product ID is required' })
  productId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Attribute ID is required' })
  attributeValueId: number;
}
