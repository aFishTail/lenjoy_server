import { Injectable } from '@nestjs/common';
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
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.postUser', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'user')
      .orderBy('reward.create_at', 'DESC');
    if (name) {
      qb.andWhere('reward.name LIKE :name', { name: `%${name}%` });
    }
    if (categoryId) {
      qb.andWhere('reward.categoryId = :categoryId', {
        categoryId: categoryId,
      });
    }
    if (isPublic) {
      qb.andWhere('reward.isPublic = :isPublic', {
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
    const reward = await qb.getOne();
    return reward;
  }

  async remove(id: string) {
    await this.dataSource.manager.transaction(async (manager) => {
      const reward = await this.resourceRepository.findOneBy({ id });
      await this.resourceRepository.softRemove(reward);
      await this.scoreService.operateWithTransaction(
        manager,
        ADMIN_USER_ID,
        {
          type: ScoreOperateType.DECREASE,
          score: reward.score,
        },
        reward.id,
        EntityTypeEnum.Reward,
      );
    });
    return null;
  }
}
