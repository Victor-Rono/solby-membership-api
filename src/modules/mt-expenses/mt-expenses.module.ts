/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MtExpensesService } from './services/mt-expenses/mt-expenses.service';
import { MtExpensesAutomationService } from './services/mt-expenses-automation/mt-expenses-automation.service';
import { MtExpensesController } from './controllers/mt-expenses/mt-expenses.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [MtExpensesService, MtExpensesAutomationService, generateCollectionProvider(DatabaseCollectionEnums.MT_EXPENSES)];
const imports: any[] = [];

@Module({
  providers,
  imports,
  controllers: [MtExpensesController],
  exports: imports.concat(providers),
  // imports: []
})
export class MtExpensesModule { }
