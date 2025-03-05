import { Test, TestingModule } from '@nestjs/testing';
import { MtExpensesAutomationService } from './mt-expenses-automation.service';

describe('MtExpensesAutomationService', () => {
  let service: MtExpensesAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtExpensesAutomationService],
    }).compile();

    service = module.get<MtExpensesAutomationService>(MtExpensesAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
