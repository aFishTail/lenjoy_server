import { Test, TestingModule } from '@nestjs/testing';
import { RewardAnswerController } from './reward-answer.controller';
import { RewardAnswerService } from './reward-answer.service';

describe('RewardAnswerController', () => {
  let controller: RewardAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardAnswerController],
      providers: [RewardAnswerService],
    }).compile();

    controller = module.get<RewardAnswerController>(RewardAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
