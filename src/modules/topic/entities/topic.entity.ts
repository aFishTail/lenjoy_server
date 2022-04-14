import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { User } from 'src/modules/user/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '标题' })
  @Column()
  title: string;

  @ApiProperty({ description: '内容' })
  @Column()
  content: string;

  @ApiProperty({ description: '是否推荐' })
  @Column({ default: false })
  recommand: boolean;

  // Todo: 推荐时间？
  // recommandTime

  @ApiProperty({ description: '观看数量' })
  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @ApiProperty({ description: '评论数量' })
  @Column({ comment: '评论数量', default: 0 })
  comment: number;

  @ApiProperty({ description: '点赞数量' })
  @Column({ comment: '点赞数量', name: 'like_count', default: 0 })
  likeCount: number;

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

  @ManyToOne(() => Category, (category) => category.topics, {
    cascade: true,
  })
  @JoinColumn()
  category: Category;

  @Column({ name: 'user_id' })
  userId: string;

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
