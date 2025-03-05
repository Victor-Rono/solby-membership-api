import { Test, TestingModule } from '@nestjs/testing';
import { MtSalesService } from './mt-sales.service';

describe('MtSalesService', () => {
  let service: MtSalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtSalesService],
    }).compile();

    service = module.get<MtSalesService>(MtSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
