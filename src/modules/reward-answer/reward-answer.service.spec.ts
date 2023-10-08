import { Test, TestingModule } from '@nestjs/testing';
import { RewardAnswerService } from './reward-answer.service';

describe('RewardAnswerService', () => {
  let service: RewardAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardAnswerService],
    }).compile();

    service = module.get<RewardAnswerService>(RewardAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
