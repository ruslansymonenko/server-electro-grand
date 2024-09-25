import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubcategoryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsNumber({}, { message: 'Category ID is required' })
  categoryId: number;
}

export class UpdateSubcategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Slug should be not empty' })
  @IsString({ message: 'Slug should be string' })
  slug: string;

  @IsOptional()
  @IsNumber({}, { message: 'Category ID is required' })
  categoryId: number;
}
