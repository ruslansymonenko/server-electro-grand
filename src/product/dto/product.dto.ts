import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description should be a string' })
  description: string;

  @IsNumber({}, { message: 'Price is required' })
  price: number;

  @IsNumber({}, { message: 'Category id is required and should be a number' })
  categoryId: number;

  @IsNumber({}, { message: 'Subcategory id is required and should be a number' })
  subcategoryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Brand id is required and should be a number' })
  brandId: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description should be a string' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price is required' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Category id is required and should be a number' })
  categoryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Subcategory id is required and should be a number' })
  subcategoryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Brand id is required and should be a number' })
  brandId: number;
}
