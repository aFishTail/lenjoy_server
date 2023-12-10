import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { ScoreService } from '../score/score.service';
import { QueryResourceInputDto } from './dto/query-resource.dto';
import { User } from '../user/entities/user.entity';
import { ScoreConfig, ScoreOperateType } from '../score/score.type';
import { EntityTypeEnum } from 'src/common/constants';
import { UserLike } from '../user-like/entities/user-like.entity';

const ResourceQueryFields = [
  'resource.id',
  'resource.name',
  'resource.score',
  'resource.isPublic',
  'resource.accessible',
  'resource.commentCount',
  'resource.viewCount',
  'resource.isPublic',
  'resource.createAt',
  'resource.userId',
  'resource.likeCount',
];

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly dataSource: DataSource,
  ) {}
  async create(createResourceDto: CreateResourceDto, userId: string) {
    const { name, url, code, isPublic, score, categoryId, content } =
      createResourceDto;
    const existCategory = await this.categoryService.findById(categoryId);
    if (!existCategory) {
      throw new BadRequestException('该主题不存在');
    }
    if (!isPublic && !score) {
      throw new BadRequestException('该资源非公开, 需要填写价值积分');
    }
    const newResource = await this.resourceRepository.create({
      name,
      url,
      haveCode: !!code,
      code,
      isPublic,
      score,
      category: existCategory,
      content,
      userId,
    });
    await this.resourceRepository.save(newResource);
    return newResource;
  }

  async queryPage(
    queryResourceDto: QueryResourceInputDto,
    userId: string | undefined,
  ) {
    const { name, categoryId, isPublic, isWithPermission, pageNum, pageSize } =
      queryResourceDto;
    const qb = this.resourceRepository
      .createQueryBuilder('resource')
      .select(ResourceQueryFields)
      .leftJoinAndSelect('resource.category', 'category')
      .leftJoinAndMapOne(
        'resource.user',
        'user',
        'user',
        'user.id = resource.userId',
      );
    if (name) {
      qb.where('resource.name LIKE :name', { name: `%${name}%` });
    }

    if (categoryId) {
      qb.andWhere('resource.categoryId = :categoryId', { categoryId });
    }
    if (isPublic != null) {
      qb.andWhere('resource.isPublic = :isPublic', { isPublic });
    }
    if (isWithPermission) {
      qb.leftJoinAndSelect(
        'resource.withPermissionUsers',
        'permissionUser',
      ).where('permissionUser.id = :userId', { userId });
    }
    qb.orderBy('resource.createAt', 'DESC');
    qb.limit(pageSize).offset((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const result = [];
    for (let i = 0; i < records.length; i++) {
      const n = { ...records[i], isLike: 0 };
      // const like = await getConnection()
      const like = await this.dataSource
        .getRepository(UserLike)
        .findOne({ where: { userId, entityId: n.id } });
      if (like) {
        n.isLike = like.status;
      }
      result.push(n);
    }
    const data = {
      records: result,
      total,
    };
    return data;
  }

  // 查询一个实例，和queryPage区别只查询
  async queryOne(id: string, userId: string) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .select(ResourceQueryFields)
      .leftJoinAndSelect('resource.category', 'category')
      .leftJoinAndMapOne(
        'resource.user',
        'user',
        'user',
        'user.id = resource.userId',
      )
      .where('resource.id = :id', { id })
      .getOne();
    const like = await this.dataSource
      .getRepository(UserLike)
      .findOne({ where: { userId, entityId: resource.id } });
    return { ...resource, isLike: like?.status ?? 0 };
  }

  async findOne(id: string, userId: string) {
    const qb = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndMapOne(
        'resource.user',
        'user',
        'user',
        'user.id = resource.user_id',
      )
      .leftJoinAndSelect('resource.category', 'category')
      .leftJoinAndSelect('resource.withPermissionUsers', 'withPermissionUser')
      .where({ id });
    const resource = await qb.getOne();
    if (!resource) {
      throw new BadRequestException('资源不存在');
    }
    resource.viewCount = resource.viewCount + 1;
    const havePayed = !!resource.withPermissionUsers.find(
      (e) => e.id === userId,
    );
    const newResource = await this.resourceRepository.save(resource);
    return { ...newResource, havePayed };
  }

  async update(updateResourceDto: UpdateResourceDto) {
    const { id, name, url, code, isPublic, categoryId, score } =
      updateResourceDto;
    const oldResource = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.category', 'category')
      .where('resource.id = :id', { id })
      .getOne();
    const newResource = {
      ...oldResource,
      name,
      url,
      haveCode: !!code,
      code,
      isPublic,
      score,
    };
    if (newResource.isPublic) newResource.score = null;
    if (categoryId && categoryId !== oldResource.category.id) {
      newResource.category = await this.categoryService.findById(categoryId);
      if (!newResource.category) {
        throw new BadRequestException('该主题不存在');
      }
    }
    const updatedTopic = this.resourceRepository.merge(
      oldResource,
      newResource,
    );
    return await this.resourceRepository.save(updatedTopic);
  }

  async remove(id: string) {
    await this.resourceRepository.softDelete({ id });
    return;
  }

  async incrViewCount(id: string) {
    return this.resourceRepository
      .createQueryBuilder()
      .update(Resource)
      .set({
        viewCount: () => 'view_count + 1',
      })
      .where('id = :id', { id })
      .execute();
  }

  async pay(id: string, userId: string) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.withPermissionUsers', 'withPermissionUser')
      .where('resource.id = :id', { id })
      .getOne();
    const { score, isPublic } = resource;
    if (isPublic) {
      throw new BadRequestException('该资源免费，无需购买');
    }
    const withPermissionUsers = resource.withPermissionUsers;
    if (withPermissionUsers.find((e) => e.id === userId)) {
      throw new BadRequestException('已支付积分，无需重复支付');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.score < score) {
      throw new BadRequestException(`积分不足${score}，无法发布悬赏`);
    }
    this.dataSource.manager.transaction(async (manager) => {
      withPermissionUsers.push(user);
      manager.getRepository(Resource).save(resource);
      try {
        await this.scoreService.operateWithTransaction(
          manager,
          resource.userId,
          {
            type: ScoreOperateType.INCREASE,
            score: resource.score * (1 - ScoreConfig.PlatformChargeRatio),
            desc: '资源被购买',
          },
          resource.id,
          EntityTypeEnum.Resource,
        );
        await this.scoreService.operateWithTransaction(
          manager,
          userId,
          {
            type: ScoreOperateType.DECREASE,
            score: resource.score,
            desc: '花费积分购买资源',
          },
          resource.id,
          EntityTypeEnum.Resource,
        );
      } catch (err) {
        throw new BadRequestException('请求异常，请稍后重试');
      }
    });
    return;
  }

  async viewResourceUrl(id: string, userId: string) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.withPermissionUsers', 'withPermissionUser')
      .where('resource.id = :id', { id })
      .getOne();
    const withPermissionUsers = resource.withPermissionUsers;
    if (
      !withPermissionUsers.find((e) => e.id === userId) &&
      resource.userId !== userId
    ) {
      throw new BadRequestException('无权访问该资源');
    }
    return {
      url: resource.url,
      code: resource.code,
    };
  }
}
