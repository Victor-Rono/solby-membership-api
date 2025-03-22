import { Test, TestingModule } from '@nestjs/testing';
import { MemberSubscriptionsService } from './member-subscriptions.service';

describe('MemberSubscriptionsService', () => {
  let service: MemberSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberSubscriptionsService],
    }).compile();

    service = module.get<MemberSubscriptionsService>(MemberSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
