import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserLike extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: '实体类型' })
  @Column({ name: 'entity_type' })
  entityType: string;

  @ApiProperty({ description: '实体id' })
  @Column({ type: 'varchar', name: 'entity_id' })
  entityId: string;

  @ApiProperty({ description: '状态' })
  @Column()
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
