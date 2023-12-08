import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomExceptionEnum } from 'src/common/exceptions/customExceptionEnum';
import { CustomRequestException } from 'src/common/exceptions/customRequest.execption';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class EmailVerifyInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { user } = request;
    const emailVerified = await this.userService.verifyEmail(user.id);
    if (!emailVerified) {
      throw new CustomRequestException(
        CustomExceptionEnum.EmailNotVerifiedCode,
        CustomExceptionEnum.EmailNotVerifiedMessage,
      );
    }
    return next.handle();
  }
}
