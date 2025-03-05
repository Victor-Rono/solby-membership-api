/* eslint-disable prettier/prettier */
import { AccountingController } from './accounting.controller';
import { Module } from '@nestjs/common';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { InvoicesModule } from '../invoices/invoices.module';
import { AccountingAutomationService } from './services/accounting-automation/accounting-automation.service';
import { AccountingService } from './services/accounting/accounting.service';



const providers: any[] = [AccountingService, AccountingAutomationService, generateCollectionProvider(DatabaseCollectionEnums.ACCOUNTING)];

@Module({
    controllers: [AccountingController],
    imports: [InvoicesModule],
    exports: providers,
    providers,
})
export class AccountingModule {

}
