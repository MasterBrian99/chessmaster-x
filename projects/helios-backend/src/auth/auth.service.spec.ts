import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { STATUS } from '../util/constant';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let passwordService: PasswordService;
  let jwtService: JwtService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        PasswordService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user and return the token', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const savedUser: UserEntity = {
        created_at: new Date(),
        status: STATUS.ACTIVE,
        updated_at: new Date(),
        id: '1',
        email: dto.email,
        password: 'hashedPassword',
      };
      const existingUser = null;
      const newUser = {
        id: '1',
        email: dto.email,
        password: 'hashedPassword',
        status: STATUS.ACTIVE,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      };
      const token = 'exampleToken';

      const findOne = jest.spyOn(userRepository, 'findOne');
      findOne.mockResolvedValue(existingUser);
      const createNewUser = jest.spyOn(authService, 'createNewUser');

      createNewUser.mockImplementation(() => Promise.resolve(savedUser));
      // jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);
      jest.spyOn(userRepository, 'save').mockImplementation((user) => {
        const userEntity: UserEntity = {
          ...user, // Copy any additional properties
          email: newUser.email,
          password: newUser.password,
          id: newUser.id,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          status: STATUS.ACTIVE,
        };

        // Check the userEntity object
        expect(userEntity).toEqual(expect.objectContaining(newUser));

        // Return the userEntity object
        return Promise.resolve(userEntity);
      });
      jest.spyOn(authService, 'getJWTPayload').mockResolvedValue(token);

      const result = await authService.create(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(authService.createNewUser).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(authService.getJWTPayload).toHaveBeenCalledWith(
        newUser.id,
        newUser.email,
      );
      expect(result).toEqual({ token });
    });
  });
  it('should throw a ConflictException if the user already exists', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const existingUser: UserEntity = {
      id: '1',
      email: dto.email,
      password: 'hashedPassword',
      status: STATUS.ACTIVE,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const findOne = jest.spyOn(userRepository, 'findOne');
    findOne.mockResolvedValue(existingUser);

    await expect(authService.create(dto)).rejects.toThrow(ConflictException);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
  });
  describe('login', () => {
    it('should authenticate the user and return the token', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user: UserEntity = {
        created_at: expect.any(Date),
        status: STATUS.ACTIVE,
        updated_at: expect.any(Date),
        id: '1',
        email: dto.email,
        password: 'hashedPassword',
      };
      const token = 'exampleToken';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(passwordService, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(authService, 'getJWTPayload').mockResolvedValue(token);

      const result = await authService.login(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        dto.password,
        user.password,
      );
      expect(authService.getJWTPayload).toHaveBeenCalledWith(
        user.id,
        user.email,
      );
      expect(result).toEqual({ token });
    });

    it('should throw an UnauthorizedException if the user is not found', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
    });
  });
  describe('testAuth', () => {
    it('should return true', async () => {
      const result = await authService.testAuth();
      expect(result).toBe(true);
    });
  });
});
