/* eslint-disable prettier/prettier */
import { ExpensesService } from "src/shared/services/expenses/expenses.service";
import { SmsService } from "../notifications/sms/services/sms/sms.service";
import { NotificationService } from "../notifications/services/notifications/notifications.service";
import { ProductsService } from "../products/products.service";
import { ReportsService } from "./services/reports/reports.service";
import { MtExpensesService } from "../mt-expenses/services/mt-expenses/mt-expenses.service";
import { MtRevenuesService } from "../mt-revenues/services/mt-revenues/mt-revenues.service";
import { ReportsController } from "./controllers/reports/reports.controller";
import { UsersModule } from "../users/users.module";
import { Module } from "@nestjs/common";
import { AccountingModule } from "../accounting/accounting.module";
import { InvoicesModule } from "../invoices/invoices.module";
import { CreditorsModule } from "../creditors/creditors.module";
import { DebtorsModule } from "../debtors/debtors.module";
import { LedgerModule } from "../ledger/ledger.module";


@Module({
    controllers: [ReportsController],
    providers: [
        ExpensesService,
        NotificationService,
        SmsService,
        ProductsService,
        // AdvanceOrdersService,
        // PayslipsService,
        // AgrovetSalesService,
        // PayrollService,
        // MilkCollectionService,
        // TransporterReportsService,
        ReportsService,
        MtExpensesService,
        MtRevenuesService,


    ],
    imports: [UsersModule, AccountingModule, InvoicesModule, CreditorsModule, DebtorsModule, LedgerModule],
})
export class ReportsModule { }
