import { Test, TestingModule } from '@nestjs/testing';
import { AssetCategoriesController } from './asset-categories.controller';

describe('AssetCategoriesController', () => {
  let controller: AssetCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetCategoriesController],
    }).compile();

    controller = module.get<AssetCategoriesController>(AssetCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
