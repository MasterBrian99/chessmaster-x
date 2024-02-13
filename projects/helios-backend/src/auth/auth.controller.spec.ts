import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { StandardResponse } from '../common/dto/standard-response';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PasswordService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserEntity,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('Create new user', () => {
    it('should create a new auth record and return a token', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'random@ffd.cc',
        password: '1234',
      };
      const expectedResult: StandardResponse<{ token: string }> = {
        statusCode: 201,
        message: 'Success',
        data: {
          token: 'random-token',
        },
      };

      jest
        .spyOn(authService, 'create')
        .mockImplementation(async () => expectedResult.data);
      const result = await controller.create(createAuthDto);

      expect(result).toEqual(expectedResult);
      expect(authService.create).toHaveBeenCalledWith(createAuthDto);
    });
  });
  describe('Login', () => {
    it('should authenticate and return a token', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'random@ffd.cc',
        password: '1234',
      };
      const expectedResult: StandardResponse<{ token: string }> = {
        statusCode: 201,
        message: 'Success',
        data: {
          token: 'random-token',
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
  describe('Testing authentication', () => {
    it('should return the result of testAuth from the authService', async () => {
      const expectedResult: StandardResponse<boolean> = {
        statusCode: 200,
        message: 'Success',
        data: true,
      };

      jest
        .spyOn(authService, 'testAuth')
        .mockImplementation(async () => expectedResult.data);

      const result = await controller.testAuth();

      expect(result).toEqual(expectedResult);
      expect(authService.testAuth).toHaveBeenCalled();
    });
  });
});
