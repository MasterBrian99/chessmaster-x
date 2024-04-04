import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTokenEntity } from '../database/entity/user-token.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATUS } from '../util/constant';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userEntityRepository: Repository<UserEntity>;
  let userTokenEntityRepository: Repository<UserTokenEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        EventEmitter2,
        {
          provide: getRepositoryToken(UserTokenEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userEntityRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    userTokenEntityRepository = moduleRef.get<Repository<UserTokenEntity>>(
      getRepositoryToken(UserTokenEntity),
    );
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('create user or check and send email', () => {
    it('should create if not exist and send email', async () => {
      const dto = { email: 'test@example.com' };

      const existingUser = null;
      const newUser = {
        id: '1',
        email: dto.email,
        password: 'hashedPassword',
        status: STATUS.ACTIVE,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      };
      const findOne = jest.spyOn(userEntityRepository, 'findOne');
      findOne.mockResolvedValue(existingUser);
      const createNewUser = jest.spyOn(authService, 'sign');
      createNewUser.mockImplementation(() => Promise.resolve());
      jest.spyOn(userEntityRepository, 'save').mockImplementation((user) => {
        const userEntity: UserEntity = {
          ...user, // Copy any additional properties
          email: newUser.email,
          id: newUser.id,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          status: STATUS.ACTIVE,
          userToken: [],
        };

        // Check the userEntity object
        expect(userEntity).toEqual(expect.objectContaining(newUser));

        // Return the userEntity object
        return Promise.resolve(userEntity);
      });
      const token = 'exampleToken';

      jest.spyOn(authService, 'getJWTPayload').mockResolvedValue(token);

      const result = await authService.sign(dto);

      expect(result).toEqual(undefined);
    });
  });
});
