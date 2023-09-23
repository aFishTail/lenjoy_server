import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';
import { EntityTypeEnum } from 'src/common/constants';
import {
  ScoreConfig,
  ScoreOperateOption,
  ScoreOperateType,
} from './score.type';
import { getOpScoreAndDesc } from './score.util';
describe('Score Service', () => {
  let service: ScoreService;
  let scoreRepository: Repository<Score>;
  let userRepository: Repository<User>;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: getRepositoryToken(Score),
          useValue: {
            find: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ScoreService>(ScoreService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    scoreRepository = module.get<Repository<Score>>(getRepositoryToken(Score));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('test rank()', () => {
    it('rank find', async () => {
      const findMock = jest.spyOn(userRepository, 'find') as any;
      findMock.mockResolvedValueOnce([
        {
          id: '1',
          username: 'zhangsan',
          score: 10,
          avatar: '',
          topicCount: 2,
          commentCount: 2,
        },
        {
          id: '2',
          username: 'lisi',
          score: 10,
          avatar: '',
          topicCount: 2,
          commentCount: 2,
        },
      ]);
      const rankList = await service.rank();
      expect(findMock).toBeCalledWith({
        select: [
          'id',
          'username',
          'score',
          'avatar',
          'topicCount',
          'commentCount',
        ],
        order: {
          score: 'DESC',
        },
        take: 10,
      });
      expect(rankList).toEqual([
        {
          userId: '1',
          username: 'zhangsan',
          score: 10,
          avatar: '',
          topicCount: 2,
          commentCount: 2,
        },
        {
          userId: '2',
          username: 'lisi',
          score: 10,
          avatar: '',
          topicCount: 2,
          commentCount: 2,
        },
      ]);
    });
  });

  describe('test list()', () => {
    it('rank list get many and ocunt', async () => {
      const findAndCountMock = jest.spyOn(
        scoreRepository,
        'findAndCount',
      ) as any;
      findAndCountMock.mockReturnValueOnce([[], 0]);
      const res = await service.list('1');
      expect(findAndCountMock).toBeCalledWith({
        where: { userId: '1' },
      });
      expect(res).toEqual({ records: [], total: 0 });
    });
  });

  describe('test operate()', () => {
    //
  });
});
