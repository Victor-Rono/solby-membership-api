/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MtRevenueCategoriesController } from './controllers/mt-revenue-categories/mt-revenue-categories.controller';
import { MtRevenueCategoriesService } from './services/mt-revenue-categories/mt-revenue-categories.service';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const imports:any[]=[];
const providers:any[]=[MtRevenueCategoriesService, generateCollectionProvider(DatabaseCollectionEnums.MT_REVENUE_CATEGORIES)];
@Module({
  controllers: [MtRevenueCategoriesController],
  providers,
  exports:imports.concat(providers)
})
export class MtRevenueCategoriesModule {}
