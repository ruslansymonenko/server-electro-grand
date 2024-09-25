import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Slug should be not empty' })
  @IsString({ message: 'Slug should be string' })
  slug: string;
}
