import { Test, TestingModule } from '@nestjs/testing';
import { BaseAutomationService } from './base-automation.service';

describe('BaseAutomationService', () => {
  let service: BaseAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseAutomationService],
    }).compile();

    service = module.get<BaseAutomationService>(BaseAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
