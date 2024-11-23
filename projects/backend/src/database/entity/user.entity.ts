import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserTokenEntity } from './user-token.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @OneToMany(() => UserTokenEntity, (userToken) => userToken.user)
  userToken: UserTokenEntity[];
}
