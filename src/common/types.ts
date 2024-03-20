import { Resource } from 'src/modules/resource/entities/resource.entity';
import { Reward } from 'src/modules/reward/entities/reward.entity';
import { Topic } from 'src/modules/topic/entities/topic.entity';

export type OperateStatus = 0 | 1;

export type MainEntity = Topic | Resource | Reward;
