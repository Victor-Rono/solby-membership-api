import { Test, TestingModule } from '@nestjs/testing';
import { MtSalesController } from './mt-sales.controller';

describe('MtSalesController', () => {
  let controller: MtSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtSalesController],
    }).compile();

    controller = module.get<MtSalesController>(MtSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
