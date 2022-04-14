import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '内容' })
  @Column()
  content: string;

  @ApiProperty({ description: '点赞数量' })
  @Column({ name: 'like_count' })
  likeCount: string;

  @ApiProperty({ description: '评论数量' })
  @Column({ name: 'comment_count' })
  commentCount: string;

  @ApiProperty({ description: '用户代理' })
  @Column({ length: 500, name: 'user_agent' })
  userAgent: string;

  @ApiProperty({ description: 'IP地址' })
  @Column({ length: 500 })
  ip: string;

  @ApiProperty({ description: '状态' })
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // 用户状态

  @ApiProperty({ description: '评论主体' })
  @Column({ comment: '评论主体', name: 'host_id' })
  hostId: string; // 评论主体的ID

  @ApiProperty({ description: '父级评论id' })
  @Column({ comment: '父级评论id', default: null, name: 'parent_comment_id' })
  parentCommentId: string; // 父级评论 id

  @ApiProperty({ description: '评论用户id' })
  @Column({ comment: '评论用户id', name: 'reply_user_id' })
  replyUserId: string; // 父级评论 id

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
