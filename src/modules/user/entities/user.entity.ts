import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  /**
   * 检测密码是否一致
   * @param password0 加密前密码
   * @param password1 加密后密码
   */
  static comparePassword(password0, password1) {
    return bcrypt.compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 500 })
  username: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ length: 500 })
  password: string;

  @ApiProperty({ description: '用户昵称' })
  @Column({ length: 500 })
  nickname: string;

  @ApiProperty({ description: '头像' })
  @Column({ length: 500, default: null })
  avatar: string; // 头像

  @ApiProperty({ description: '邮箱' })
  @Column({ length: 500, default: null, unique: true })
  email: string; // 邮箱

  @ApiProperty({ description: '邮箱' })
  @Column({ default: false, name: 'emial_verified' })
  emailVerified: boolean; // 邮箱

  @ApiProperty({ description: '描述' })
  @Column({ length: 500, default: null })
  description: string;

  // @Column({ default: 'normal' })
  // type: string; // 用户类型
  @ApiProperty({ description: '积分' })
  @Column({ default: 0 })
  score: number;

  @ApiProperty({ description: '话题数量' })
  @Column({ name: 'topic_count', default: 0 })
  topicCount: number;

  @ApiProperty({ description: '评论数量' })
  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @ApiProperty({ description: '粉丝数量' })
  @Column({ name: 'fans_count', default: 0 })
  fansCount: number;

  @ApiProperty({ description: '关注数量' })
  @Column({ name: 'follow_count', default: 0 })
  followCount: number;

  @ApiProperty({ description: '角色' })
  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string; // 用户角色

  @ApiProperty({ description: '状态' })
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // 用户状态

  @ApiProperty({ description: '禁言时间' })
  @Column({
    type: 'datetime',
    comment: '禁言时间',
    name: 'forbidden_end_time',
    nullable: true,
  })
  forbiddenEndTime: Date;

  @ApiProperty()
  @OneToMany(() => ThirdAccount, (thirdAccount) => thirdAccount.user)
  thirdAccount: ThirdAccount[];

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

  /**
   * 插入数据前，对密码进行加密
   */
  @BeforeInsert()
  beforeHandler() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}

@Entity()
export class ThirdAccount extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.thirdAccount)
  user: User;

  @ApiProperty()
  @Column()
  Avatar: string;

  @ApiProperty()
  @Column({ name: 'nickname' })
  Nickname: string;

  @ApiProperty()
  @Column('simple-enum', {
    enum: ['github', 'qq', 'weixin'],
    default: 'github',
    name: 'third_type',
  })
  ThirdType;

  @ApiProperty()
  @Column({
    name: 'third_id',
  })
  ThirdId: string;

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
