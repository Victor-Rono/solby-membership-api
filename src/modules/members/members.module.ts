/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { MembersService } from './services/members/members.service';
import { MembersAutomationService } from './services/members-automation/members-automation.service';
import { MembersController } from './controllers/members/members.controller';
import { FarmersModule } from '../farmers/farmers.module';
import { generateCollectionProvider } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { InvoiceManagerService } from '../invoices/services/invoice-manager/invoice-manager.service';
import { MemberSubscriptionsService } from './services/member-subscriptions/member-subscriptions.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

const imports: any[] = [AuthModule, UsersModule];
const providers: any[] = [MembersService, MembersAutomationService, InvoiceManagerService, MemberSubscriptionsService, generateCollectionProvider(DatabaseCollectionEnums.MEMBERS)];

@Module({
  providers,
  imports,
  controllers: [MembersController],
  exports: imports.concat(providers),
})

@Global()
export class MembersModule { }
