import { Resource } from 'src/modules/resource/entities/resource.entity';
import { Reward } from 'src/modules/reward/entities/reward.entity';
import { Topic } from 'src/modules/topic/entities/topic.entity';
import { EntityTypeEnum } from './constants';

export const EntityMap = {
  [EntityTypeEnum.Topic]: Topic,
  [EntityTypeEnum.Resource]: Resource,
  [EntityTypeEnum.Reward]: Reward,
} as const;
