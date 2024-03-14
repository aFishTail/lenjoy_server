import {
  MessageFactory,
  MessageFactoryInterface,
} from './messageFactoryInterface';
import { TopicMessage } from './topicMessage';

export enum TopicMessageTypeEnum {
  Comment,
  Like,
  Favorite,
  Recommend,
  DeleteFromAdmin,
}

export class TopicMessageFactory extends MessageFactory {
  type: TopicMessageTypeEnum;
  createMessage(): string {
    const message = new TopicMessage(this.type);
    return message.message();
    // if (this.type === TopicMessageTypeEnum.Comment) {
    //   return message.beComment();
    // }
  }
}
