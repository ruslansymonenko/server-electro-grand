import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttributeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;
}

export class UpdateAttributeDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;
}
