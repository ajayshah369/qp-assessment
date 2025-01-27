import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
