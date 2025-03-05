import { Test, TestingModule } from '@nestjs/testing';
import { UsersAutomationService } from './users-automation.service';

describe('UsersAutomationService', () => {
  let service: UsersAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersAutomationService],
    }).compile();

    service = module.get<UsersAutomationService>(UsersAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
