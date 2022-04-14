import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export class UserSign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: '最后一次签到时间' })
  @Column({
    comment: '最后一次签到时间',
    type: 'datetime',
    name: 'last_sign_time',
  })
  lastSignTime: Date;

  @ApiProperty({ description: '连续签到天数' })
  @Column({ comment: '连续签到天数', name: 'continuty_days' })
  continutyDays: number;

  @ApiProperty({ description: '累计签到天数' })
  @Column({ comment: '累计签到天数', name: 'series_days' })
  seriesDays: number;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
export class UserSignLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ name: 'user_id' })
  userId: string;

  //   user_id	int	11	用户id
  // sign_reward	text	0	签到奖励内容
  // sign_time	datetime	0	签到时间
  // sign_type
  @ApiProperty({ description: '签到奖励内容' })
  @Column({ comment: '签到奖励内容', name: 'sign_reward' })
  signReward: string;

  @ApiProperty({ description: '签到奖励内容' })
  @Column({ comment: '签到时间', type: 'datetime', name: 'sign_time' })
  signTime: Date;

  @ApiProperty({ description: '签到类型' })
  @Column({ comment: '签到类型, 1=签到，2=补签', name: 'sign_type' })
  signType: number;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
