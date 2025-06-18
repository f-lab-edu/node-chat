import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SignupAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
