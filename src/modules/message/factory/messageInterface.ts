// export enum MessageTypeEnum {
//   user,
//   system,
// }

import { TopicMessageTypeEnum } from './topicMessageFactory';

export interface MessageInterface {
  type: unknown;
  entityName?: string;
  formUserName?: string;
  // message(): string;
}
