import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @IsString({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password should be at least 6 characters',
  })
  password: string;

  @IsOptional()
  @IsString({
    message: 'Name is required',
  })
  name: string;
}
