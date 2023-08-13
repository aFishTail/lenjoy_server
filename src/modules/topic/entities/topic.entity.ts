import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity()
export class Topic extends BaseEntity {
  static modelName = 'topic';

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '标题' })
  @Column({ length: 50 })
  title: string;

  @ApiProperty({ description: '摘要' })
  @Column({ length: 255 })
  summary: string;

  @ApiProperty({ description: '内容' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: '是否推荐' })
  @Column({ default: 0 })
  recommand: number;

  // Todo: 推荐时间？
  // recommandTime

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

  @ApiProperty({ description: '最后评论时间' })
  @Column({ type: 'datetime', name: 'last_comment_time', nullable: true })
  lastCommentTime: Date;

  @ApiProperty({ description: '最后评论人' })
  @Column({ name: 'last_comment_user', nullable: true })
  lastCommentUser: string;

  @ApiProperty({ description: '用户代理' })
  @Column({ length: 500, name: 'user_agent', nullable: true })
  userAgent: string;

  @ApiProperty({ description: 'IP地址' })
  @Column({ length: 500, nullable: true })
  ip: string;

  @ApiProperty({ type: Category, isArray: true })
  @ManyToOne(() => Category, (category) => category.resources, {
    cascade: true,
  })
  @JoinColumn()
  category: Category;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;

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
