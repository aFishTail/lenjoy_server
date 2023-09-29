import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reward extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '标题' })
  @Column({ length: 50 })
  title: string;

  @ApiProperty({ description: '内容' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: '观看数量' })
  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @ApiProperty({ description: '评论数量' })
  @Column({ comment: '评论数量', default: 0, name: 'comment_count' })
  commentCount: number;

  @ApiProperty({ description: '点赞数量' })
  @Column({ comment: '点赞数量', name: 'like_count', default: 0 })
  likeCount: number;

  @ApiProperty({ description: '收藏数量' })
  @Column({ comment: '收藏数量', name: 'favorite_count', default: 0 })
  favoriteCount: number;

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
  @JoinColumn()
  postUser: User;

  @ApiProperty()
  @OneToOne(() => User)
  @JoinColumn()
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
