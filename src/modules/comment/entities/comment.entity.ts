import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '内容' })
  @Column()
  content: string;

  @ApiProperty({ description: '点赞数量' })
  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @ApiProperty({ description: '评论数量' })
  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @ApiProperty({ description: '用户代理' })
  @Column({ length: 500, name: 'user_agent' })
  userAgent: string;

  @ApiProperty({ description: 'IP地址' })
  @Column({ length: 500 })
  ip: string;

  @ApiProperty({ description: '状态' })
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // 用户状态

  @ApiProperty({ description: '评论用户id' })
  @Column({ comment: '评论用户id', name: 'user_id' })
  userId: string; // 评论主体的ID

  @ApiProperty({ description: '评论主体，比如帖子' })
  @Column({ comment: '评论主体,比如帖子', name: 'entity_id' })
  entityId: string; // 评论主体的ID

  @ApiProperty({ description: '引用的评论id' })
  @Column({
    comment: '引用的评论id',
    nullable: true,
    name: 'quote_id',
  })
  quoteId: string;

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
