import { Test, TestingModule } from '@nestjs/testing';
import { BaseSocketService } from './base-socket.service';

describe('BaseSocketService', () => {
  let service: BaseSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseSocketService],
    }).compile();

    service = module.get<BaseSocketService>(BaseSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
