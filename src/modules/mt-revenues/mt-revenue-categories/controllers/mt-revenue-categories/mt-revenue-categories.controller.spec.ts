import { Test, TestingModule } from '@nestjs/testing';
import { MtRevenueCategoriesController } from './mt-revenue-categories.controller';

describe('MtRevenueCategoriesController', () => {
  let controller: MtRevenueCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtRevenueCategoriesController],
    }).compile();

    controller = module.get<MtRevenueCategoriesController>(MtRevenueCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
