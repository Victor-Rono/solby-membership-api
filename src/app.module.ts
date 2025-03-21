/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './modules/tenants/tenants.module';
import { BaseModule } from './modules/base/base.module';
import { EventsModule } from './integrations/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { SmsModule } from './modules/notifications/sms/sms.module';
import { EmailsModule } from './integrations/emails/emails.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { FileManagerModule } from './integrations/file-manager/file-manager.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { CreditorsModule } from './modules/creditors/creditors.module';
import { DebtorsModule } from './modules/debtors/debtors.module';
import { ProductsModule } from './modules/products/products.module';
import { MtSalesModule } from './modules/mt-sales/mt-sales.module';
import { MtPurchasesModule } from './modules/mt-purchases/mt-purchases.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MtRevenuesModule } from './modules/mt-revenues/mt-revenues.module';
import { MtExpensesModule } from './modules/mt-expenses/mt-expenses.module';
import { UsersModule } from './modules/users/users.module';
import { FarmersModule } from './modules/farmers/farmers.module';
import { MembersModule } from './modules/members/members.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { GroupsModule } from './modules/groups/groups.module';



const imports: any[] = [
  TenantsModule,
  BaseModule,
  EventsModule,
  AuthModule,
  SmsModule,
  EmailsModule,
  TenantsModule,
  DashboardModule,
  AccountingModule,
  InvoicesModule,
  FileManagerModule,
  LedgerModule,
  CreditorsModule,
  DebtorsModule,
  ProductsModule,
  MtSalesModule,
  MtPurchasesModule,
  ReportsModule,
  MtRevenuesModule,
  MtExpensesModule,
  UsersModule,
  // FarmersModule,
  MembersModule,
  SubscriptionsModule,
  GroupsModule,

];



const providers: any[] = [
  AppService,
];




@Module({
  imports,
  controllers: [AppController],
  providers,
  exports: imports.concat(providers),
})
export class AppModule { }
