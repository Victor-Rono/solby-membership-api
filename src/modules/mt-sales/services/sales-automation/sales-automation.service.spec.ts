import { Test, TestingModule } from '@nestjs/testing';
import { SalesAutomationService } from './sales-automation.service';

describe('SalesAutomationService', () => {
  let service: SalesAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesAutomationService],
    }).compile();

    service = module.get<SalesAutomationService>(SalesAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
