import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { StandardResponse } from '../common/dto/standard-response';
import SUCCESS_MESSAGES from '../util/success-messages';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      return new StandardResponse(
        HttpStatus.CREATED,
        SUCCESS_MESSAGES.SUCCESS,
        await this.authService.create(createAuthDto),
      );
    } catch (e) {
      throw e;
    }
  }
  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    try {
      return new StandardResponse(
        HttpStatus.CREATED,
        SUCCESS_MESSAGES.SUCCESS,
        await this.authService.login(dto),
      );
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testAuth() {
    try {
      return new StandardResponse(
        HttpStatus.OK,
        SUCCESS_MESSAGES.SUCCESS,
        await this.authService.testAuth(),
      );
    } catch (e) {
      throw e;
    }
  }
}
