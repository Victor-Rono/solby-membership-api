import { Test, TestingModule } from '@nestjs/testing';
import { MtPayrollService } from './mt-payroll.service';

describe('MtPayrollService', () => {
  let service: MtPayrollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtPayrollService],
    }).compile();

    service = module.get<MtPayrollService>(MtPayrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
