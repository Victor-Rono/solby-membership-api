import { Test, TestingModule } from '@nestjs/testing';
import { MtExpenseCategoriesService } from './mt-expense-categories.service';

describe('MtExpenseCategoriesService', () => {
  let service: MtExpenseCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtExpenseCategoriesService],
    }).compile();

    service = module.get<MtExpenseCategoriesService>(MtExpenseCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
