/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { MtPayrollService } from './services/mt-payroll/mt-payroll.service';
import { MtPayrollAutomationService } from './services/mt-payroll-automation/mt-payroll-automation.service';
import { MtPayrollController } from './controllers/mt-payroll/mt-payroll.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [MtPayrollService, MtPayrollAutomationService, generateCollectionProvider(DatabaseCollectionEnums.PAYROLL)];
@Module({
  providers,
  controllers: [MtPayrollController],
  exports: providers,
})
@Global()
export class MtPayrollModule { }
