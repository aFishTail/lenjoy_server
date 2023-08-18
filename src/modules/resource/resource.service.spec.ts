import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CategoryService } from '../category/category.service';

describe('ResourceService', () => {
  let service: ResourceService;
  let categoryService: CategoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceService, CategoryService],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    categoryService = module.get<CategoryService>(CategoryService);
    // catsController = moduleRef.get<Repository>(CatsController);
  });

  it('test created', () => {
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
    jest.spyOn(categoryService, 'findById').mockImplementation(() => ({}))
    const result = service.create(params, userId);
    // expect(service).toBeDefined();
  });
});
