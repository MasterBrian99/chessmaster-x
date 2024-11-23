import { BadRequestException, Injectable } from '@nestjs/common';
import { SignAuthDto } from './dto/sign-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import generateToken from '../util/email-token';
import { UserTokenEntity } from '../database/entity/user-token.entity';
import { Logger } from '@nestjs/common/services';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import ERROR_MESSAGES from '../util/error-messages';
import { LoginAuthDto } from './dto/login-auth.dto';
import { STATUS } from '../util/constant';
import { AuthUser } from './auth-user';
import { JwtPayload } from './jwt/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserTokenEntity)
    private readonly userTokenRepository: Repository<UserTokenEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}
  async sign(dto: SignAuthDto) {
    const isExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    try {
      let user: UserEntity = null;
      if (isExist) {
        user = isExist;
      } else {
        const newUser = new UserEntity();
        newUser.email = dto.email;
        user = await this.userRepository.save(newUser);
      }
      const token = await this.generateMagicLink(user);

      this.eventEmitter.emit('user.sign', {
        email: dto.email,
        token: token,
      });

      return;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateMagicLink(user: UserEntity) {
    const token = generateToken(user.email);
    const userToken = new UserTokenEntity();
    userToken.token = token;
    userToken.user = user;
    await this.userTokenRepository.save(userToken);
    return token;
  }
  async login(dto: LoginAuthDto) {
    const isExist = await this.userTokenRepository.findOne({
      where: { token: dto.token, status: STATUS.ACTIVE },
      relations: ['user'],
    });
    if (!isExist) {
      throw new BadRequestException(ERROR_MESSAGES.TOKEN_VERIFICATION_FAILED);
    }
    if (isExist.expiredAt < new Date()) {
      throw new BadRequestException(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    await this.userTokenRepository.update(
      {
        id: isExist.id,
      },
      {
        status: STATUS.DELETED,
      },
    );
    const token = await this.getJWTPayload(isExist.user.id, isExist.user.email);
    return {
      token: token,
    };
  }
  async getJWTPayload(id: string, email: string): Promise<string> {
    const payload: JwtPayload = {
      id: id,
      email: email,
    };
    return await this.jwtService.signAsync(payload);
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.id,
        email: payload.email,
        status: STATUS.ACTIVE,
      },
    });
    if (user) {
      return user;
    }
    return null;
  }
}
