export const ADMIN_USER_ID = 'admin';

export enum ScoreOperateType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

export interface ScoreOperateOption {
  type: ScoreOperateType;
  score: number;
  desc?: string;
}

export const ScoreConfig = {
  PostTopic: 5, // 发布帖子奖励
  PostResource: 5, // 发布资源奖励
  PlatformChargeRatio: 0.2, // 平台抽取交易比例
} as const;
