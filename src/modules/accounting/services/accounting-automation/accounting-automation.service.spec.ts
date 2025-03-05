import { Test, TestingModule } from '@nestjs/testing';
import { AccountingAutomationService } from './accounting-automation.service';

describe('AccountingAutomationService', () => {
  let service: AccountingAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountingAutomationService],
    }).compile();

    service = module.get<AccountingAutomationService>(AccountingAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
