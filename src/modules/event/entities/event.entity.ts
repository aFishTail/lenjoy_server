import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ comment: '事件来源类型' })
  fromType: string;

  @Column({ comment: '事件类型' })
  type: string;

  @Column({ comment: '事件接收人' })
  @ManyToOne(() => User)
  toUser: User;

  @Column({ length: 100, comment: '消息内容' })
  content: string;

  @Column({ comment: '事件触发人' })
  @ManyToOne(() => User)
  fromUser: User;

  @Column({ comment: '触发事件的实体类型' })
  entityType: string;

  @Column({ comment: '触发事件的实体id' })
  entityId: string;

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
