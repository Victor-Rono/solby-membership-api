import { Test, TestingModule } from '@nestjs/testing';
import { MtExpenseCategoriesController } from './mt-expense-categories.controller';

describe('MtExpenseCategoriesController', () => {
  let controller: MtExpenseCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtExpenseCategoriesController],
    }).compile();

    controller = module.get<MtExpenseCategoriesController>(MtExpenseCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
