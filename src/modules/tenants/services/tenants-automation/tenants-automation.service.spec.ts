import { Test, TestingModule } from '@nestjs/testing';
import { TenantsAutomationService } from './tenants-automation.service';

describe('TenantsAutomationService', () => {
  let service: TenantsAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsAutomationService],
    }).compile();

    service = module.get<TenantsAutomationService>(TenantsAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
