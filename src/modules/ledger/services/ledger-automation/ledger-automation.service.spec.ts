import { Test, TestingModule } from '@nestjs/testing';
import { LedgerAutomationService } from './ledger-automation.service';

describe('LedgerAutomationService', () => {
  let service: LedgerAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LedgerAutomationService],
    }).compile();

    service = module.get<LedgerAutomationService>(LedgerAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
