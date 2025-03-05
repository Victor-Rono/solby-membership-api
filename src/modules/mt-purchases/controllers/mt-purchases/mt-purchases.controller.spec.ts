import { Test, TestingModule } from '@nestjs/testing';
import { MtPurchasesController } from './mt-purchases.controller';

describe('MtPurchasesController', () => {
  let controller: MtPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtPurchasesController],
    }).compile();

    controller = module.get<MtPurchasesController>(MtPurchasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
