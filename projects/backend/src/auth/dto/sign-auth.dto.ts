import { IsEmail } from 'class-validator';

export class SignAuthDto {
  @IsEmail()
  email: string;
}
