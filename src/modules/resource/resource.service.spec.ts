import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CategoryService } from '../category/category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { ScoreService } from '../score/score.service';

describe('ResourceService', () => {
  let service: ResourceService;
  let categoryService: CategoryService;
  let resourceRepository: Repository<Resource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: CategoryService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ScoreService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    categoryService = module.get<CategoryService>(CategoryService);
    resourceRepository = module.get<Repository<Resource>>(
      getRepositoryToken(Resource),
    );
  });

  it('test haveCode but code is undefined', async () => {
    const params: CreateResourceDto = {
      name: 'test resource',
      url: 'baidu.com',
      haveCode: true,
      code: '',
      isPublic: false,
      score: 100,
      categoryId: 'categoryId',
    };
    const userId = 'userId';
    jest
      .spyOn(categoryService, 'findById')
      .mockResolvedValueOnce({ id: 'categoryId' } as Category);
    expect(async () => {
      await service.create(params, userId);
    }).rejects.toThrow(
      new BadRequestException('该资源需要密码,链接密码不能为空'),
    );
  });

  it('test haveCode but code is undefined', async () => {
    const params: CreateResourceDto = {
      name: 'test resource',
      url: 'baidu.com',
      haveCode: true,
      code: '1234',
      isPublic: false,
      score: undefined,
      categoryId: 'categoryId',
    };
    const userId = 'userId';
    jest
      .spyOn(categoryService, 'findById')
      .mockResolvedValueOnce({ id: 'categoryId' } as Category);
    expect(async () => {
      await service.create(params, userId);
    }).rejects.toThrow(
      new BadRequestException('该资源非公开, 需要填写价值积分'),
    );
  });

  it('test create resource success', async () => {
    const params: CreateResourceDto = {
      name: 'test resource',
      url: 'baidu.com',
      haveCode: true,
      code: '1234',
      isPublic: false,
      score: 1000,
      categoryId: 'categoryId',
    };
    const userId = 'userId';
    jest
      .spyOn(categoryService, 'findById')
      .mockResolvedValueOnce({ id: 'categoryId' } as Category);
    await service.create(params, userId);
    expect(resourceRepository.save).toHaveBeenCalled();
  });
});
