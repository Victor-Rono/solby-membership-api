import { Test, TestingModule } from '@nestjs/testing';
import { MtPayrollAutomationService } from './mt-payroll-automation.service';

describe('MtPayrollAutomationService', () => {
  let service: MtPayrollAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtPayrollAutomationService],
    }).compile();

    service = module.get<MtPayrollAutomationService>(MtPayrollAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
