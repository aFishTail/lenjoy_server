import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // const tokenUser = this.jwtService.decode(token) as User;
    // const userId = tokenUser.id;
    // const exist = await this.userService.findById(userId);
    // const isAdmin = userId && exist.role === 'admin';
    // return this.articleService.findById(id, status, isAdmin);
    return data ? user?.[data] : user;
  },
);
