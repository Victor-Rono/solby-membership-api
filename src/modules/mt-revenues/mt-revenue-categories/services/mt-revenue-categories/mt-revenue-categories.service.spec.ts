import { Test, TestingModule } from '@nestjs/testing';
import { MtRevenueCategoriesService } from './mt-revenue-categories.service';

describe('MtRevenueCategoriesService', () => {
  let service: MtRevenueCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtRevenueCategoriesService],
    }).compile();

    service = module.get<MtRevenueCategoriesService>(MtRevenueCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
