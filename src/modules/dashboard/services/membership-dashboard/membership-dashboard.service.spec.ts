import { Test, TestingModule } from '@nestjs/testing';
import { MembershipDashboardService } from './membership-dashboard.service';

describe('MembershipDashboardService', () => {
  let service: MembershipDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipDashboardService],
    }).compile();

    service = module.get<MembershipDashboardService>(MembershipDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
