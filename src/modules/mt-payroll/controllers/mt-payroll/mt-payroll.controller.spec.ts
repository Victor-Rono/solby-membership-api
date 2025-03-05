import { Test, TestingModule } from '@nestjs/testing';
import { MtPayrollController } from './mt-payroll.controller';

describe('MtPayrollController', () => {
  let controller: MtPayrollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtPayrollController],
    }).compile();

    controller = module.get<MtPayrollController>(MtPayrollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
