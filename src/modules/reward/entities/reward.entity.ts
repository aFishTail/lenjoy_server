import { ApiProperty } from '@nestjs/swagger';
import { Topic } from 'src/modules/topic/entities/topic.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reward {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @OneToOne('topic')
  topic: Topic;

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    comment: '悬赏积分',
  })
  score: number;

  @ApiProperty()
  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    comment: '是否公开悬赏结果',
  })
  isPublic: boolean;

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    comment: '0 进行中，1 结束，2 撤销',
  })
  status: number;

  @ApiProperty()
  @OneToOne(() => User)
  postUser: User;

  @ApiProperty()
  @OneToOne(() => User)
  rewardUser: User;

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
