import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ScoreService } from '../score/score.service';
import { ScoreOperateType } from '../score/score.type';
import { EntityTypeEnum } from 'src/common/constants';

describe('RewardService', () => {
  let service: RewardService;
  let scoreService: ScoreService;
  let rewardRepository: Repository<Reward>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardService,
        {
          provide: getRepositoryToken(Reward),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: ScoreService,
          useValue: {
            operate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RewardService>(RewardService);
    scoreService = module.get<ScoreService>(ScoreService);
    rewardRepository = module.get<Repository<Reward>>(
      getRepositoryToken(Reward),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test reward create', async () => {
    const params: CreateRewardDto = {
      score: 100,
      isPublic: true,
      title: 'reward topic',
      content: 'content',
      summary: 'content',
      categoryId: 'categoryId',
    };
    const userId = 'userId';
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockResolvedValueOnce({ id: userId } as User);
    jest
      .spyOn(rewardRepository, 'save')
      .mockResolvedValueOnce({ id: 'rewardId' } as Reward);
    await service.create(params, userId);
    expect(rewardRepository.create).toHaveBeenCalledWith({
      ...params,
      postUser: { id: userId },
    });
    expect(rewardRepository.save).toHaveBeenCalled();
    expect(scoreService.operate).toHaveBeenCalledWith(
      userId,
      {
        type: ScoreOperateType.DECREASE,
        score: params.score,
      },
      'rewardId',
      EntityTypeEnum.Reward,
    );
  });

  it('test reward findAll', async () => {
    const params = {
      title: 'title',
      pageNum: 1,
      pageSize: 10,
    };
    const userId = 'userId';
    const result = await service.findAll(params, userId);
    // jest.spyOn(rewardRepository, 'find')
  });
});
