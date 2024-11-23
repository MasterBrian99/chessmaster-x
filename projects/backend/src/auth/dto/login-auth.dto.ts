import { IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  token: string;
}
