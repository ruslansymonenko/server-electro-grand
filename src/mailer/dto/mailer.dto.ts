import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendCallbackFormDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone should be string' })
  phone: string;
}

export class SendContactFormDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email should be string' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString({ message: 'Subject should be string' })
  subject: string;

  @IsNotEmpty({ message: 'Message is required' })
  @IsString({ message: 'Message should be string' })
  message: string;
}
