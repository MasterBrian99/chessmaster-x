import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { UserTokenEntity } from '../database/entity/user-token.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignAuthDto } from './dto/sign-auth.dto';
import { StandardResponse } from '../common/standard-response';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,

        EventEmitter2,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserEntity,
        },
        {
          provide: getRepositoryToken(UserTokenEntity),
          useClass: UserTokenEntity,
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });
  describe('Create new user', () => {
    it('should create a new auth record and return a token', async () => {
      const createAuthDto: SignAuthDto = {
        email: 'random@ffd.cc',
      };
      const expectedResult: StandardResponse<null> = {
        statusCode: 201,
        message: 'Success',
      };

      jest
        .spyOn(authService, 'sign')
        .mockImplementation(async () => expectedResult.data);
      const result = await controller.sign(createAuthDto);

      expect(result).toEqual(expectedResult);
      expect(authService.sign).toHaveBeenCalledWith(createAuthDto);
    });
  });
  describe('Login', () => {
    it('should authenticate and return a token', async () => {
      const loginAuthDto: LoginAuthDto = {
        token: 'random@ffd.cc',
      };
      const expectedResult: StandardResponse<{ token: string }> = {
        statusCode: 201,
        message: 'Success',
        data: {
          token: 'asdad',
        },
      };

      jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => expectedResult.data);

      const result = await controller.login(loginAuthDto);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginAuthDto);
    });
  });
});
