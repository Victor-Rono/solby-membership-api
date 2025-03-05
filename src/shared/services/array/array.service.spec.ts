import { Test, TestingModule } from '@nestjs/testing';
import { ArrayService } from './array.service';

describe('ArrayService', () => {
  let service: ArrayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrayService],
    }).compile();

    service = module.get<ArrayService>(ArrayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
