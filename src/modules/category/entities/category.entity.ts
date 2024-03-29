import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  DeleteDateColumn,
} from 'typeorm';
import { Topic } from 'src/modules/topic/entities/topic.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from 'src/modules/resource/entities/resource.entity';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '名称' })
  @Column({ length: 10, unique: true })
  name: string;

  @ApiProperty({ description: 'label值' })
  @Column({ length: 36 })
  label: string;

  @ApiProperty()
  // TODO: 能否获取到当前实例的名称
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ description: '图标', nullable: true })
  @Column({ length: 500, comment: '图标', nullable: true })
  logo: string;

  @ApiProperty({ description: '排序', default: 0 })
  @Column({ comment: '排序', default: 0 })
  sortNo: number;

  @ApiProperty({ description: '状态', default: 1 })
  @Column({ comment: '状态, 1: 正常，0: 停止使用', default: 1 })
  status: number;

  @OneToMany(() => Topic, (topic) => topic.category)
  topics: Array<Topic>;

  @OneToMany(() => Resource, (resource) => resource.category)
  resources: Array<Resource>;

  @DeleteDateColumn({ nullable: false })
  deletedTime: Date;

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
