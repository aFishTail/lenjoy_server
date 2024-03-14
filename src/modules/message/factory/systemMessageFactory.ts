import { MessageFactory } from './messageFactoryInterface';
import { SystemMessage } from './systemMessage';

export enum SystemMessageTypeEnum {
  DailySignIn,
  FirstPost,
}

export class SystemMessageFactory extends MessageFactory {
  private type: SystemMessageTypeEnum;
  createMessage(): string {
    const message = new SystemMessage(this.type);
    return message.message();
    // if (this.type === TopicMessageTypeEnum.Comment) {
    //   return message.beComment();
    // }
  }
}
