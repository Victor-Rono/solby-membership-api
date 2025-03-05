/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { MtPurchasesService } from './services/mt-purchases/mt-purchases.service';
import { PurchasesAutomationService } from './services/purchases-automation/purchases-automation.service';
import { MtPurchasesController } from './controllers/mt-purchases/mt-purchases.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { generateCollectionProvider } from 'src/database/database.functions';

const imports: any[] = [InvoicesModule];
const providers: any[] = [MtPurchasesService, PurchasesAutomationService, generateCollectionProvider(DatabaseCollectionEnums.INVOICES)]
@Module({
  providers,
  controllers: [MtPurchasesController],
  imports,
  exports: imports.concat(providers),
})
@Global()
export class MtPurchasesModule { }
