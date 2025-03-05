import { Test, TestingModule } from '@nestjs/testing';
import { MtRevenuesService } from './mt-revenues.service';

describe('MtRevenuesService', () => {
  let service: MtRevenuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtRevenuesService],
    }).compile();

    service = module.get<MtRevenuesService>(MtRevenuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
