import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/request/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';
import ERROR_MESSAGES from 'src/util/error-messages';
import { PasswordService } from './password.service';
import { LoginAuthDto } from './dto/request/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}
  async create(dto: CreateAuthDto) {
    const isAlreadyRegistered = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (isAlreadyRegistered) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }
    try {
      const hashedPassword = await this.passwordService.hashPassword(
        dto.password,
      );

      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      const token = await this.jwtService.signAsync({
        jti: uuidv4(),
        id: newUser.id,
      });

      return {
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async login(dto: LoginAuthDto) {
    const isAlreadyExist = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!isAlreadyExist) {
      throw new ConflictException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    try {
      const token = await this.jwtService.signAsync({
        jti: uuidv4(),
        id: isAlreadyExist.id,
      });

      return {
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async testAuth(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user.email;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
