/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { MtSalesService } from './services/mt-sales/mt-sales.service';
import { MtSalesController } from './controllers/mt-sales/mt-sales.controller';
import { SalesAutomationService } from './services/sales-automation/sales-automation.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const imports: any[] = [InvoicesModule];
const providers: any[] = [MtSalesService, SalesAutomationService, generateCollectionProvider(DatabaseCollectionEnums.INVOICES)]
@Module({
  providers,
  controllers: [MtSalesController],
  imports,
  exports: imports.concat(providers)
})
@Global()
export class MtSalesModule { }
