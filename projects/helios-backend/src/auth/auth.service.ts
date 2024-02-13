import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import ERROR_MESSAGES from '../util/error-messages';
import { PasswordService } from './password.service';
import { STATUS } from '../util/constant';
import { JwtPayload } from './jwt/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(dto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }
    try {
      const user = await this.createNewUser(dto);
      await this.userRepository.save(user);
      const token = await this.getJWTPayload(user.id, user.email);
      return { token };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNewUser(dto: CreateAuthDto) {
    const user = new UserEntity();
    user.email = dto.email;
    user.password = await this.passwordService.hashPassword(dto.password);
    return user;
  }
  async validateUser(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id, status: STATUS.ACTIVE },
    });

    if (user !== null && user.email === payload.email) {
      delete user.password;
      return user;
    }
    return null;
  }
  async getJWTPayload(id: string, email: string): Promise<string> {
    const payload: JwtPayload = {
      id: id,
      email: email,
    };
    return await this.jwtService.signAsync(payload);
  }
  async login(dto: LoginAuthDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (
      !(await this.passwordService.validatePassword(
        dto.password,
        user.password,
      )) ||
      dto.password.length < 0
    ) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    try {
      const token = await this.getJWTPayload(user.id, user.email);
      return { token };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async testAuth() {
    return true;
  }
}
