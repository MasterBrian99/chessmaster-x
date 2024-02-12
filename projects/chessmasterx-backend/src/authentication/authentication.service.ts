import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { PrismaService } from 'nestjs-prisma';
import ERROR_MESSAGES from '../util/error-messages';

@Injectable()
export class AuthenticationService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateAuthenticationDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }
    return 'This action adds a new authentication';
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, _updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
