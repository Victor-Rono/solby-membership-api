import { Test, TestingModule } from '@nestjs/testing';
import { MtRevenuesController } from './mt-revenues.controller';

describe('MtRevenuesController', () => {
  let controller: MtRevenuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtRevenuesController],
    }).compile();

    controller = module.get<MtRevenuesController>(MtRevenuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
