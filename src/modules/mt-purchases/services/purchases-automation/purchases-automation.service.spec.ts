import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesAutomationService } from './purchases-automation.service';

describe('PurchasesAutomationService', () => {
  let service: PurchasesAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasesAutomationService],
    }).compile();

    service = module.get<PurchasesAutomationService>(PurchasesAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
