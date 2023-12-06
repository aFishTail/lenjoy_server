import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntityTypeEnum } from 'src/common/constants';
import { ScoreService } from 'src/modules/score/score.service';
import { UserService } from 'src/modules/user/user.service';

const PostTopicUrl = '/api/topic/create';
const PostResourceUrl = '/api/topic/create';
const PostRewardUrl = '/api/topic/create';

@Injectable()
export class FirstPostInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { user, url } = request;
    return next.handle().pipe(
      tap((data) => {
        const { id } = data;
        switch (url) {
          case PostTopicUrl:
            this.userService.postFirstContent(
              user.id,
              EntityTypeEnum.Topic,
              id,
            );
            break;
          case PostResourceUrl:
            this.userService.postFirstContent(
              user.id,
              EntityTypeEnum.Resource,
              id,
            );
            break;
          case PostRewardUrl:
            this.userService.postFirstContent(
              user.id,
              EntityTypeEnum.Reward,
              id,
            );
            break;
        }
      }),
    );
  }
}
