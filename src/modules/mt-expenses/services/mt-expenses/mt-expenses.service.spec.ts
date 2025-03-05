import { Test, TestingModule } from '@nestjs/testing';
import { MtExpensesService } from './mt-expenses.service';

describe('MtExpensesService', () => {
  let service: MtExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtExpensesService],
    }).compile();

    service = module.get<MtExpensesService>(MtExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
