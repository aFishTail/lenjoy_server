import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entities/user.entity';
import { getManager } from 'typeorm';

export const EntityAuth = (model: any, idKey: string) =>
  SetMetadata('entity', [model, idKey]);

@Injectable()
export class EntityAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [model, entityId] = this.reflector.get<string>(
      'entity',
      context.getHandler(),
    );
    if (!model || !entityId) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    let token = request.headers.authorization;

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }
    const user = this.jwtService.decode(token) as User;
    if (!user) {
      return false;
    }
    const entityIdValue = request.body[entityId];
    const entity: Record<string, string> & { userId: string } =
      await getManager().findOne(model, entityIdValue);
    // const hasRole = roles.some((role) => role === user.role);
    return entity && entity.userId === user.id;
  }
}
