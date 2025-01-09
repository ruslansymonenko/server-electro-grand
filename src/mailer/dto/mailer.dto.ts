import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendCallbackFormDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone should be string' })
  phone: string;
}
