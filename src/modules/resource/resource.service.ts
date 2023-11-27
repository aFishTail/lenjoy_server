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
    const data = {
      records,
      total,
    };
    return data;
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

  async pay(id: string, userId: string) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.withPermissionUsers', 'withPermissionUser')
      .where('resource.id = :id', { id })
      .getOne();
    const withPermissionUsers = resource.withPermissionUsers;
    if (withPermissionUsers.find((e) => e.id === userId)) {
      throw new BadRequestException('已支付积分，无需重复支付');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    withPermissionUsers.push(user);
    this.resourceRepository.save(resource);
    return;
  }
}
