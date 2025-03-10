/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FarmersService } from './services/farmers/farmers.service';
import { FarmersAutomationService } from './services/farmers-automation/farmers-automation.service';
import { FarmersController } from './controllers/farmers/farmers.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

const imports: any[] = [];
const providers: any[] = [FarmersService, FarmersAutomationService, generateCollectionProvider(DatabaseCollectionEnums.FARMERS)];

@Module({
  providers,
  controllers: [FarmersController],
  exports: imports.concat(providers),
})
export class FarmersModule { }
