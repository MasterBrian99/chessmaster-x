import {
  Controller,
  Post,
  Body,

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignAuthDto } from './dto/sign-auth.dto';
import { StandardResponse } from '../common/standard-response';
import { HttpStatus } from '@nestjs/common/enums';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign')
  async sign(@Body() dto: SignAuthDto) {
    try {
      return new StandardResponse(
        HttpStatus.CREATED,
        'Success',
        await this.authService.sign(dto),
      );
    } catch (error) {
      throw error;
    }
  }
  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    try {
      return new StandardResponse(
        HttpStatus.CREATED,
        'Success',
        await this.authService.login(dto),
      );
    } catch (error) {
      throw error;
    }
  }

}
