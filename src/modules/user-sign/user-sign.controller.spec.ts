import { Test, TestingModule } from '@nestjs/testing';
import { UserSignController } from './user-sign.controller';
import { UserSignService } from './user-sign.service';

describe('UserSignController', () => {
  let controller: UserSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSignController],
      providers: [UserSignService],
    }).compile();

    controller = module.get<UserSignController>(UserSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
