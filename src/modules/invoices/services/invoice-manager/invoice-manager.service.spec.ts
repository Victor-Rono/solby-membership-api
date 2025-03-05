import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceManagerService } from './invoice-manager.service';

describe('InvoiceManagerService', () => {
  let service: InvoiceManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceManagerService],
    }).compile();

    service = module.get<InvoiceManagerService>(InvoiceManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
