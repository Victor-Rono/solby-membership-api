import { Test, TestingModule } from '@nestjs/testing';
import { MPesaService } from './m-pesa.service';

describe('MPesaService', () => {
  let service: MPesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MPesaService],
    }).compile();

    service = module.get<MPesaService>(MPesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
