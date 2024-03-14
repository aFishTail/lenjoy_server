import { MessageInterface } from './messageInterface';
import { TopicMessageTypeEnum } from './topicMessageFactory';

export class DailySignInMessage implements MessageInterface {
  private type: TopicMessageTypeEnum;
  private entityName: string;
  private fromUserName: string;
  constructor(type: TopicMessageTypeEnum) {
    this.type = type;
  }
  message(): string {
    switch (this.type) {
    }
  }
}
