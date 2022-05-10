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

export enum IScoreConfig {
  PostTopic = 5,
}

export enum IMessageType {
  TypeTopicComment = 0, // 收到话题评论
  TypeCommentReply = 1, // 收到他人回复
  TypeTopicLike = 2, // 收到点赞
  TypeTopicFavorite = 3, // 话题被收藏
  TypeTopicRecommend = 4, // 话题被设为推荐
  TypeTopicDelete = 5, // 话题被删除
  TypeArticleComment = 6, // 收到文章评论
}
