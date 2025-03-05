import { Test, TestingModule } from '@nestjs/testing';
import { MtExpensesController } from './mt-expenses.controller';

describe('MtExpensesController', () => {
  let controller: MtExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtExpensesController],
    }).compile();

    controller = module.get<MtExpensesController>(MtExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
