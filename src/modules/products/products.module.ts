/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const providers: any[] = [ProductsService, generateCollectionProvider(DatabaseCollectionEnums.PRODUCTS)];



@Module({
  providers,
  controllers: [ProductsController],

  exports: providers,
})
export class ProductsModule { }
