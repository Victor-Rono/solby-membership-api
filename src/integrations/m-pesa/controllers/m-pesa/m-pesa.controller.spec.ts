import { Test, TestingModule } from '@nestjs/testing';
import { MPesaController } from './m-pesa.controller';

describe('MPesaController', () => {
  let controller: MPesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MPesaController],
    }).compile();

    controller = module.get<MPesaController>(MPesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
