/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MtExpenseCategoriesService } from './services/mt-expense-categories/mt-expense-categories.service';
import { MtExpenseCategoriesAutomationService } from './services/mt-expense-categories-automation/mt-expense-categories-automation.service';
import { MtExpenseCategoriesController } from './controllers/mt-expense-categories/mt-expense-categories.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [MtExpenseCategoriesService, MtExpenseCategoriesAutomationService, generateCollectionProvider(DatabaseCollectionEnums.MT_EXPENSE_CATEGORIES)];
const imports: any[] = [];
@Module({
  providers,
  imports,
  exports: imports.concat(providers),
  controllers: [MtExpenseCategoriesController]
})
export class MtExpenseCategoriesModule {

}
