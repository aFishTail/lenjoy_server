import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: '操作主体类型' })
  @Column({ name: 'source_type' })
  sourceType: string;

  @ApiProperty({ description: '操作主体id' })
  @Column({ name: 'source_id' })
  sourceId: string;

  @ApiProperty({ description: '描述' })
  @Column()
  description: string;

  @ApiProperty({ description: '操作类型' })
  @Column('simple-enum', { enum: ['increase', 'decrease'] })
  operation: string;

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
