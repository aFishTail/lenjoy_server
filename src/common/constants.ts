export enum IFollowStatus {
  followed,
  unfollow,
}
export enum IUserLikeStatus {
  like,
  unlike,
}

export enum IUserSignType {
  normal = 1,
  repair = 2,
}
export const IEntityTypeList = ['topic', 'comment'];

export enum EntityTypeEnum {
  Topic = 'topic',
  Resource = 'resource',
  Reward = 'reward',
  SignIn = 'signIn',
}

// export const MessageTypeConstant = {
//   topicComment: { type: 'topicComment', message: '话题被评论' },
//   topicLike: { type: 'topicLike', message: '话题被点赞' },
//   topicFavorite: { type: 'topicFavorite', message: '话题被收藏' },
//   topicRecommend: { type: 'topicRecommend', message: '话题被推荐' },
//   topicDeleteFromAdmin: {
//     type: 'topicDeleteFromAdmin',
//     message: '话题被管理员删除',
//   },
//   resourceComment: { type: 'resourceComment', message: '资源被评论' },
//   resourceLike: { type: 'resourceLike', message: '资源被点赞' },
//   resourceFavorite: { type: 'resourceFavorite', message: '资源被收藏' },
//   resourceRecommend: { type: 'resourceRecommend', message: '资源被推荐' },
//   resourceDeleteFromAdmin: {
//     type: 'resourceDeleteFromAdmin',
//     message: '资源被管理员删除',
//   },
//   rewardComment: { type: 'rewardComment', message: '悬赏被评论' },
//   rewardLike: { type: 'rewardLike', message: '悬赏被点赞' },
//   rewardFavorite: { type: 'rewardFavorite', message: '悬赏被搜藏' },
//   rewardRecommend: { type: 'rewardRecommend', message: '悬赏被推荐' },
//   rewardDeleteFromAdmin: {
//     type: 'rewardDeleteFromAdmin',
//     message: '悬赏被管理员删除',
//   },
//   rewardAnswerBeConfirm: {
//     type: 'rewardAnswerBeConfirm',
//     message: '悬赏回答被确认为正常答案',
//   },
//   dailySignIn: { type: 'dailySignIn', message: '每日签到' },
//   firstPostResource: { type: 'firstPostResource', message: '第一次发布资源' },
// } as const;

export enum ThirdAccountType {
  GITHUB = 0,
  QQ = 1,
}

export enum EventFromTypeEnum {
  user = 'user',
  system = 'system',
}

export enum EventTypeEnum {
  comment = 'comment',
  like = 'like',
  unLike = 'unLike',
  favorite = 'favorite',
  unFavorite = 'unFavorite',
  recommend = 'recommend',
  unRecommend = 'unRecommend',
  deleteByAdmin = 'deleteByAdmin',
  beSelectedForRewardAnswer = 'beSelectedForRewardAnswer',
  dailySignIn = 'dailySignIn',
}
