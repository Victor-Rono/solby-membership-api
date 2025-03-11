/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubscriptionsService } from './services/subscriptions/subscriptions.service';
import { SubscriptionsAutomationService } from './services/subscriptions-automation/subscriptions-automation.service';
import { SubscriptionsController } from './controllers/subscriptions/subscriptions.controller';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';


const imports: any[] = [];
const providers: any[] = [SubscriptionsService, SubscriptionsAutomationService, generateCollectionProvider(DatabaseCollectionEnums.SUBSCRIPTIONS)];


@Module({
  providers,
  imports,
  exports: providers.concat(imports),
  controllers: [SubscriptionsController]
})
export class SubscriptionsModule { }
