import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_token' })
export class UserTokenEntity extends BaseEntity {
  @Column({ type: 'text' })
  token: string;
  @Column({
    name: 'valid_until',
    type: 'timestamp without time zone',
    default: () => "(timezone('Asia/Colombo', now()) + interval '1 hour')",
    // utc'::text, now()) + '1 hour'::interval)",
  })
  expiredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userToken)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
