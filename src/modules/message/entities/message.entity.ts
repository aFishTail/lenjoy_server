import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'from_user_id', comment: '消息发送人' })
  fromUserId: string;

  @Column({ name: 'user_id', comment: '消息接收人' })
  userId: string;

  @Column({ length: 50, comment: '消息标题' })
  title: string;

  @Column({ length: 100, comment: '消息内容' })
  content: string;

  @Column({ length: 100, comment: '引用内容' })
  quoteContent: string;

  @Column({ comment: '消息类型' })
  type: number;

  @Column({ type: 'int', comment: '0:未读， 1:已读' })
  status: number;

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
