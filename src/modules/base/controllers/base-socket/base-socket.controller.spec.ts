import { Test, TestingModule } from '@nestjs/testing';
import { BaseSocketController } from './base-socket.controller';

describe('BaseSocketController', () => {
  let controller: BaseSocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseSocketController],
    }).compile();

    controller = module.get<BaseSocketController>(BaseSocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
