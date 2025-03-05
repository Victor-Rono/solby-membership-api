import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceManagerController } from './invoice-manager.controller';

describe('InvoiceManagerController', () => {
  let controller: InvoiceManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceManagerController],
    }).compile();

    controller = module.get<InvoiceManagerController>(InvoiceManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
