import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserTokenEntity } from './entity/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserTokenEntity])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
