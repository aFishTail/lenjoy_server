import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

/**
 * 由于 jwt guard 只有使用时，才能获取到当前用户，如果没有使用，接口不可访问也就会报错
 * 使用此中间件给 request 添加当前访问用户，如果没有jwt信息则为空
 */
@Injectable()
export class QueryUserMiddler implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    let token = (req.headers as any).authorization;
    if (!token) {
      next();
      return;
    }
    if (/Bearer/.test(token)) {
      token = token.split(' ').pop();
    }
    const user = this.jwtService.decode(token) as User;
    (req as any).user = user;
    next();
  }
}
