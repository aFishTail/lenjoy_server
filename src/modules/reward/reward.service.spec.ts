import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';

describe('RewardService', () => {
  let service: RewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardService],
    }).compile();

    service = module.get<RewardService>(RewardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test reward create', () => {
    const params: CreateRewardDto = {
      score: 100,
      isPublic: true,
      title: 'reward topic',
      content: 'content',
      summary: 'content',
      categoryId: 'categoryId',
    };
    service.create(params);
  });
});
