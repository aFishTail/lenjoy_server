import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { CommonResponseMessage } from 'src/common/commonResponseMessage';

export const EntityAuth = (model: any, idKey: string) =>
  SetMetadata('entity', [model, idKey]);

@Injectable()
export class EntityAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [model, entityId] = this.reflector.get<any>(
      'entity',
      context.getHandler(),
    ) as any;
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
    const entity = await this.dataSource
      .getRepository(model)
      .createQueryBuilder(model.name)
      .leftJoinAndSelect(`${model.name}.user`, 'user')
      .where({ id: entityIdValue })
      .getOne();
    if (!entity) {
      throw new BadRequestException(CommonResponseMessage.EntityNiotFound);
    }
    return entity?.userId === user.id || entity?.user?.id === user.id;
  }
}
