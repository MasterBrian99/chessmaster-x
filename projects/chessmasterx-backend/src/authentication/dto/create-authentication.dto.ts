import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateAuthenticationDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 4,
  })
  password: string;
}
