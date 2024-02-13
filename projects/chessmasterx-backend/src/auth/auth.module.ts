import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
