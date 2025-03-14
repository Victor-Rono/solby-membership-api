import { Test, TestingModule } from '@nestjs/testing';
import { GroupsAutomationService } from './groups-automation.service';

describe('GroupsAutomationService', () => {
  let service: GroupsAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsAutomationService],
    }).compile();

    service = module.get<GroupsAutomationService>(GroupsAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
