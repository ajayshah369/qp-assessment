import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'password must be at least 6 characters',
  })
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name: string;
}
