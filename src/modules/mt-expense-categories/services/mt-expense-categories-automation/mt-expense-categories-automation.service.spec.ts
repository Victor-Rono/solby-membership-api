import { Test, TestingModule } from '@nestjs/testing';
import { MtExpenseCategoriesAutomationService } from './mt-expense-categories-automation.service';

describe('MtExpenseCategoriesAutomationService', () => {
  let service: MtExpenseCategoriesAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtExpenseCategoriesAutomationService],
    }).compile();

    service = module.get<MtExpenseCategoriesAutomationService>(MtExpenseCategoriesAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
