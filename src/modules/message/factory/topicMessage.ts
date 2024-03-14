import { MessageInterface } from './messageInterface';
import { TopicMessageTypeEnum } from './topicMessageFactory';

export class TopicMessage implements MessageInterface {
  private type: TopicMessageTypeEnum;
  private entityName: string;
  private fromUserName: string;
  constructor(type: TopicMessageTypeEnum) {
    this.type = type;
  }
  message(): string {
    switch (this.type) {
      case TopicMessageTypeEnum.Comment:
        return `${this.fromUserName} 评论了您的话题【${this.entityName}】`;
      case TopicMessageTypeEnum.Like:
        return `${this.fromUserName} 点赞了您的话题【${this.entityName}】`;
      case TopicMessageTypeEnum.Favorite:
        return `${this.fromUserName} 收藏了您的话题【${this.entityName}】`;
      case TopicMessageTypeEnum.Recommend:
        return `您的话题【${this.entityName}】被管理员推荐置顶`;
      case TopicMessageTypeEnum.DeleteFromAdmin:
        return `您的话题【${this.entityName}】被管理员删除`;
    }
  }
}
