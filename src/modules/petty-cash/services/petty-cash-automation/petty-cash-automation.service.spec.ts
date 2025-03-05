import { Test, TestingModule } from '@nestjs/testing';
import { PettyCashAutomationService } from './petty-cash-automation.service';

describe('PettyCashAutomationService', () => {
  let service: PettyCashAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PettyCashAutomationService],
    }).compile();

    service = module.get<PettyCashAutomationService>(PettyCashAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
