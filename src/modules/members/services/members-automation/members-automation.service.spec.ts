import { Test, TestingModule } from '@nestjs/testing';
import { MembersAutomationService } from './members-automation.service';

describe('MembersAutomationService', () => {
  let service: MembersAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersAutomationService],
    }).compile();

    service = module.get<MembersAutomationService>(MembersAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
