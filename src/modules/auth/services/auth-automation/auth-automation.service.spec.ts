import { Test, TestingModule } from '@nestjs/testing';
import { AuthAutomationService } from './auth-automation.service';

describe('AuthAutomationService', () => {
  let service: AuthAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthAutomationService],
    }).compile();

    service = module.get<AuthAutomationService>(AuthAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
