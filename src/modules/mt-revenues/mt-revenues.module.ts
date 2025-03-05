/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MtRevenuesController } from './controllers/mt-revenues/mt-revenues.controller';
import { MtRevenueCategoriesModule } from './mt-revenue-categories/mt-revenue-categories.module';
import { MtRevenuesService } from './services/mt-revenues/mt-revenues.service';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

@Module({
  providers: [MtRevenuesService, generateCollectionProvider(DatabaseCollectionEnums.MT_REVENUES)],
  controllers: [MtRevenuesController],
  imports: [MtRevenueCategoriesModule],
  // exports:[]
})
export class MtRevenuesModule {}
