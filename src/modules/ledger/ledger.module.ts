/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { LedgerService } from './services/ledger/ledger.service';
import { LedgerAutomationService } from './services/ledger-automation/ledger-automation.service';
import { LedgerController } from './controllers/ledger/ledger.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [LedgerService, LedgerAutomationService, generateCollectionProvider(DatabaseCollectionEnums.LEDGER)]
@Module({
  providers,
  controllers: [LedgerController],
  exports: providers,
})
@Global()
export class LedgerModule { }
