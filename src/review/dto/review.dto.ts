import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Text is required' })
  @IsString({ message: 'Text should be string' })
  text: string;

  @IsInt({ message: 'Rating should be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;

  @IsNumber({}, { message: 'Product id is required' })
  productId: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Text is required' })
  @IsString({ message: 'Text should be string' })
  text: string;

  @IsOptional()
  @IsInt({ message: 'Rating should be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;
}
