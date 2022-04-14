import { Test, TestingModule } from '@nestjs/testing';
import { UserLikeController } from './user-like.controller';
import { UserLikeService } from './user-like.service';

describe('UserLikeController', () => {
  let controller: UserLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLikeController],
      providers: [UserLikeService],
    }).compile();

    controller = module.get<UserLikeController>(UserLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
