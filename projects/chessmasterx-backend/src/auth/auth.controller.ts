import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/request/create-auth.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { StandardResponse } from 'src/common/dto/standard-response';
import SUCCESS_MESSAGES from 'src/util/success-messages';
import { LoginAuthDto } from './dto/request/login-auth.dto';
import { Usr } from './user.decorator';
import { AuthUser } from './auth-user';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      const { token }: { token: string } =
        await this.authService.create(createAuthDto);
      res.cookie('jwt', token, { httpOnly: true });

      res
        .status(201)
        .send(
          new StandardResponse(
            HttpStatus.CREATED,
            SUCCESS_MESSAGES.USER_CREATED,
          ),
        );
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() res: Response) {
    const { token }: { token: string } = await this.authService.login(dto);
    res.cookie('jwt', token, { httpOnly: true });
    res
      .status(201)
      .send(
        new StandardResponse(
          HttpStatus.CREATED,
          SUCCESS_MESSAGES.USER_LOGGED_IN,
        ),
      );
  }

  @UseGuards(AuthGuard)
  @Get('test')
  async testAuth(@Usr() user: AuthUser) {
    console.log('user', user);

    try {
      return new StandardResponse(
        HttpStatus.OK,
        SUCCESS_MESSAGES.SUCCESS,
        await this.authService.testAuth(user.id),
      );
    } catch (err: unknown) {
      throw err;
    }
  }
}
