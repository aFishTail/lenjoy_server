import { ApiProperty } from '@nestjs/swagger';
import { Reward } from 'src/modules/reward/entities/reward.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RewardAnswer extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '内容' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @ManyToOne(() => User)
  user: User;

  @ApiProperty()
  @ManyToOne(() => Reward, (reward) => reward.rewardAnswers)
  reward: Reward;

  @ApiProperty()
  @Column({ type: 'boolean', comment: '是否悬赏答案', default: false })
  isConfirmedAnswer: boolean;

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
