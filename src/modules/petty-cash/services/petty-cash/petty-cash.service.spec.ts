import { Test, TestingModule } from '@nestjs/testing';
import { PettyCashService } from './petty-cash.service';

describe('PettyCashService', () => {
  let service: PettyCashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PettyCashService],
    }).compile();

    service = module.get<PettyCashService>(PettyCashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
