import { Test, TestingModule } from '@nestjs/testing';
import { FarmersAutomationService } from './farmers-automation.service';

describe('FarmersAutomationService', () => {
  let service: FarmersAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmersAutomationService],
    }).compile();

    service = module.get<FarmersAutomationService>(FarmersAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
