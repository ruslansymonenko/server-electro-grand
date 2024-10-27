import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AttributeValueDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  value: string;

  @IsNumber({}, { message: 'Attribute ID is required' })
  attributeId: number;
}

export class UpdateAttributeValueDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  value: string;

  @IsOptional()
  @IsNumber({}, { message: 'Attribute ID is required' })
  attributeId: number;
}
