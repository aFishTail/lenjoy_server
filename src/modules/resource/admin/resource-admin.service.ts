import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreService } from 'src/modules/score/score.service';
import { Repository, DataSource } from 'typeorm';
import { ADMIN_USER_ID, ScoreOperateType } from 'src/modules/score/score.type';
import { EntityTypeEnum } from 'src/common/constants';
import { Resource } from '../entities/resource.entity';
import { QueryResourceAdminInputDto } from './dto/query-resource-admin.dto';

@Injectable()
export class ResourceAdminService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly scoreService: ScoreService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(payload: QueryResourceAdminInputDto) {
    const { name, pageNum, pageSize, isPublic, categoryId } = payload;
    const qb = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.category', 'category')
      .leftJoinAndSelect('resource.withPermissionUsers', 'withPermissionUser')
      .leftJoinAndMapOne(
        'resource.user',
        'user',
        'user',
        'user.id = resource.userId',
      )
      .orderBy('resource.create_at', 'DESC');
    if (name) {
      qb.andWhere('resource.name LIKE :name', { name: `%${name}%` });
    }
    if (categoryId) {
      qb.andWhere('resource.categoryId = :categoryId', {
        categoryId: categoryId,
      });
    }
    if (isPublic) {
      qb.andWhere('resource.isPublic = :isPublic', {
        isPublic: isPublic,
      });
    }
    qb.limit(pageSize).offset((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const data = {
      records,
      total,
    };
    return data;
  }

  async findOne(id: string) {
    const qb = this.resourceRepository
      .createQueryBuilder('resource')
      .where({ id });
    const resource = await qb.getOne();
    if (!resource) {
      throw new BadRequestException('资源不存在');
    }
    return resource;
  }

  async remove(id: string) {
    await this.dataSource.manager.transaction(async (manager) => {
      const resource = await this.resourceRepository.findOneBy({ id });
      await this.resourceRepository.softRemove(resource);
      await this.scoreService.operateWithTransaction(
        manager,
        ADMIN_USER_ID,
        {
          type: ScoreOperateType.DECREASE,
          score: resource.score,
        },
        resource.id,
        EntityTypeEnum.Reward,
      );
    });
    return null;
  }
}
