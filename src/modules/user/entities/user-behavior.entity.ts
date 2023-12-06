import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserBehavior extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => User)
  user: User;

  @ApiProperty()
  @Column({ type: Boolean, default: false, comment: '每日签到' })
  dailyCheckIn: boolean;

  @ApiProperty()
  @Column({ type: Boolean, default: false, comment: '第一次发帖子' })
  haveFirstTopic: boolean;

  @ApiProperty()
  @Column({ type: Boolean, default: false, comment: '第一次发帖子' })
  haveFirstResource: boolean;

  @ApiProperty()
  @Column({ type: Boolean, default: false, comment: '第一次发布悬赏' })
  haveFirstReward: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
