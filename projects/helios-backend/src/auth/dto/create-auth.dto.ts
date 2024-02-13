import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
