import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScoreOperateType } from '../score.type';

@Entity()
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: '操作主体类型' })
  @Column({ name: 'source_type' })
  entityType: string;

  @ApiProperty({ description: '操作主体id' })
  @Column({ name: 'source_id' })
  entityId: string;

  @ApiProperty({ description: '操作类型' })
  @Column({
    type: 'enum',
    enum: ScoreOperateType,
    nullable: false,
    comment: '操作类型',
  })
  type: ScoreOperateType;

  @ApiProperty({ description: '分数' })
  @Column()
  score: number;

  @ApiProperty({ description: '描述' })
  @Column()
  description: string;

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
