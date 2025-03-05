import { Test, TestingModule } from '@nestjs/testing';
import { MtPurchasesService } from './mt-purchases.service';

describe('MtPurchasesService', () => {
  let service: MtPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtPurchasesService],
    }).compile();

    service = module.get<MtPurchasesService>(MtPurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
