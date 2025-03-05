import { Test, TestingModule } from '@nestjs/testing';
import { PettyCashController } from './petty-cash.controller';

describe('PettyCashController', () => {
  let controller: PettyCashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PettyCashController],
    }).compile();

    controller = module.get<PettyCashController>(PettyCashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
