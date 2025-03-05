/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AssetCategoriesService } from './services/asset-categories/asset-categories.service';
import { AssetCategoriesController } from './controllers/asset-categories/asset-categories.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

@Module({
  providers: [AssetCategoriesService, generateCollectionProvider(DatabaseCollectionEnums.ASSET_CATEGORIES)],
  controllers: [AssetCategoriesController]
})
export class AssetCategoriesModule { }
