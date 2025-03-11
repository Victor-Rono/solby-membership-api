import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsAutomationService } from './subscriptions-automation.service';

describe('SubscriptionsAutomationService', () => {
  let service: SubscriptionsAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsAutomationService],
    }).compile();

    service = module.get<SubscriptionsAutomationService>(SubscriptionsAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
