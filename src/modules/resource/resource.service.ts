import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { ScoreService } from '../score/score.service';
import { QueryResourceDto } from './dto/query-resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly dataSource: DataSource,
  ) {}
  async create(createResourceDto: CreateResourceDto, userId: string) {
    const { name, url, haveCode, code, isPublic, score, categoryId } =
      createResourceDto;
    const existCategory = await this.categoryService.findById(categoryId);
    if (haveCode && !code) {
      throw new BadRequestException('该资源需要密码,链接密码不能为空');
    }
    if (!isPublic && !score) {
      throw new BadRequestException('该资源非公开, 需要填写价值积分');
    }
    const newResource = await this.resourceRepository.create({
      name,
      url,
      haveCode,
      code,
      isPublic,
      score,
      category: existCategory,
      userId,
    });
    await this.resourceRepository.save(newResource);
    return newResource;
  }

  async queryPage(
    queryResourceDto: QueryResourceDto,
    userId: string | undefined,
  ) {
    const { name, categoryId, isPublic, isWithPermission } = queryResourceDto;
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
      qb.leftJoinAndSelect('resource.withPermissionUsers', 'user').where(
        'user.id = :userId',
        { userId },
      );
    }
    qb.orderBy('resource.createAt', 'DESC');
    const [records, total] = await qb.getManyAndCount();
    const data = {
      records,
      total,
    };
    return data;
  }

  async findOne(id: string) {
    const resource = await this.resourceRepository.findOneBy({ id });
    if (!resource) {
      throw new BadRequestException('资源不存在');
    }
    resource.viewCount = resource.viewCount + 1;
    return await this.resourceRepository.save(resource);
  }

  async update(updateResourceDto: UpdateResourceDto) {
    const { id, name, url, haveCode, code, isPublic, categoryId } =
      updateResourceDto;
    // const oldResource = await this.resourceRepository.findOne({
    //   where: { id },
    // });
    const oldResource = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.category', 'category')
      .where('resource.id = :id', { id })
      .getOne();
    const newResource = {
      ...oldResource,
      name,
      url,
      haveCode,
      code,
      isPublic,
    };
    if (categoryId && categoryId !== oldResource.category.id) {
      newResource.category = await this.categoryService.findById(categoryId);
    }
    const updatedTopic = this.resourceRepository.merge(
      oldResource,
      newResource,
    );
    return await this.resourceRepository.save(updatedTopic);
  }

  async remove(id: string) {
    return await this.resourceRepository.delete({ id });
  }
}
