/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DebtorsService } from './services/debtors/debtors.service';
import { DebtorsController } from './controllers/debtors/debtors.controller';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { generateCollectionProvider } from 'src/database/database.functions';


const providers: any[] = [DebtorsService,
  generateCollectionProvider(DatabaseCollectionEnums.DEBTORS)];
@Module({
  controllers: [DebtorsController],
  providers,
  exports: providers,
})
export class DebtorsModule { }
