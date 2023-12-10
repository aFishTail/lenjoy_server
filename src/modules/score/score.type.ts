import { random } from 'lodash';

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
  PostFirstTopic: 10,
  PostFirstResource: 10,
  PostFirstReward: 10,
  PostTopic: 5, // 发布帖子奖励
  PostResource: 5, // 发布资源奖励
  PlatformChargeRatio: 0.2, // 平台抽取交易比例
} as const;

export const ScoreDesc = {
  PostFirstTopic: '发布第一个话题',
  PostFirstResource: '发布第一个资源',
  PostFirstReward: '发布第一个悬赏',
  DailySignIn: '日常签到',
} as const;

export const getSignInScore = () => {
  return random(2, 5);
};
