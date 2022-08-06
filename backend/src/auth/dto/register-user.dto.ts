import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @MaxLength(255)
  @MinLength(3)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(50)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
