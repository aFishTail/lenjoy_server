import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ScoreService } from 'src/modules/score/score.service';

const PostTopicUrl = '/api/topic/create';
const PostResourceUrl = '/api/topic/create';
const PostRewardUrl = '/api/topic/create';

@Injectable()
export class FirstPostInterceptor implements NestInterceptor {
  constructor(private scoreService: ScoreService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { user, url } = request;
    switch (url) {
      case PostTopicUrl:
        console.log('发布来topic');
        break;
      case PostResourceUrl:
        console.log('发布来Res');
        break;
      case PostRewardUrl:
        console.log('发布来reward');
        break;
    }
    return next.handle().pipe(tap(() => console.log(`after`)));
  }
}
