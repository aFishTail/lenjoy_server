import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Resource extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '资源名称' })
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ description: '链接', nullable: false })
  @Column({ length: 255 })
  url: string;

  @ApiProperty({ description: '是否加密', nullable: false })
  @Column({ type: 'boolean' })
  haveCode: boolean;

  @ApiProperty({ description: '链接密码' })
  @Column({ length: 20, nullable: true })
  code: string;

  @ApiProperty({ description: '是否可以访问' })
  @Column({ type: 'boolean', nullable: false, default: true })
  accessible: boolean;

  @ApiProperty({ description: '最后检查时间' })
  @Column({
    type: 'datetime',
    name: 'last_check_time',
    nullable: true,
    comment: '最后检查时间',
  })
  lastCheckTime: Date;

  @ApiProperty()
  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: '所属用户',
    nullable: false,
  })
  userId: string;

  @ApiProperty()
  @Column({ type: 'boolean', nullable: false, default: true })
  isPublic: boolean;

  // 非public资源可以查看的用户集合
  @ApiProperty()
  @ManyToMany(() => User)
  @JoinTable()
  withPermissionUsers: User[];

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    comment: '非public资源需要积分才可以查看',
  })
  score: number;

  @ApiProperty({ type: Category, isArray: true })
  @ManyToOne(() => Category)
  category: Category;

  @ApiProperty({ description: '内容' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: '是否推荐' })
  @Column({ default: 0 })
  recommend: number;

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

  @ApiProperty({ type: User })
  @ManyToOne(() => User)
  user: User;

  @DeleteDateColumn({ nullable: false })
  deletedTime: Date;

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
