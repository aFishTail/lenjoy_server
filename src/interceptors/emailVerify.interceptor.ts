import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class EmailVerifyInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { user } = request;
    const emailVerified = this.userService.verifyEmail(user.id);
    if (!emailVerified) {
      throw new BadRequestException('用户邮箱未认证');
    }
    return next.handle();
  }
}
