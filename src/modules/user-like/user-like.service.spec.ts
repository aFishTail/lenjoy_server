import { Test, TestingModule } from '@nestjs/testing';
import { UserLikeService } from './user-like.service';

describe('UserLikeService', () => {
  let service: UserLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLikeService],
    }).compile();

    service = module.get<UserLikeService>(UserLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
