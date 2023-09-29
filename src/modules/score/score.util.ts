import { EntityTypeEnum } from 'src/common/constants';
import {
  ScoreConfig,
  ScoreOperateOption,
  ScoreOperateType,
} from './score.type';

// 获取操作类型的积分
export function getOpScoreAndDesc(
  typeOption: ScoreOperateType | ScoreOperateOption,
  entityType: EntityTypeEnum,
) {
  let type: ScoreOperateType, score: number, desc: string;
  if (typeof typeOption === 'string') {
    type = typeOption;
    score = getOperateScore(entityType);
    desc = getOperateDesc(type, entityType);
  } else {
    type = typeOption.type;
    score = typeOption.score;
    desc = typeOption.desc ?? getOperateDesc(type, entityType);
  }
  return { type, score, desc };
}

export function getOperateScore(entityType: EntityTypeEnum) {
  let result: number;
  switch (entityType) {
    case EntityTypeEnum.Topic:
      result = ScoreConfig.PostTopic;
      break;
  }
  return result;
}

export function getOperateDesc(
  type: ScoreOperateType,
  entityType: EntityTypeEnum,
) {
  let result: string;
  switch (entityType) {
    case EntityTypeEnum.Topic:
      result = `${type === ScoreOperateType.INCREASE ? '发布' : '删除'}帖子`;
      break;
    case EntityTypeEnum.Reward:
      result = `${type === ScoreOperateType.INCREASE ? '发布' : '删除'}悬赏`;
      break;
    default:
      break;
  }
  return result;
}

/**
 * 获取积分操作的变化
 * @param newScore
 * @param oldScore
 * @returns
 */
export function getChangeInfo(newScore: number, oldScore) {
  const type =
    newScore > oldScore ? ScoreOperateType.INCREASE : ScoreOperateType.DECREASE;
  const score = Math.abs(newScore - oldScore);
  return { type, score };
}
