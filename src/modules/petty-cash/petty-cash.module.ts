/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PettyCashService } from './services/petty-cash/petty-cash.service';
import { PettyCashAutomationService } from './services/petty-cash-automation/petty-cash-automation.service';
import { PettyCashController } from './controllers/petty-cash/petty-cash.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [PettyCashService, PettyCashAutomationService, generateCollectionProvider(DatabaseCollectionEnums.PETTY_CASH)];
const imports: any[] = [];

@Module({
  providers,
  imports,
  controllers: [PettyCashController],
  exports: imports.concat(providers),
})
@Global()
export class PettyCashModule { }
