/* eslint-disable prettier/prettier */

import { generateUniqueId } from "src/database/database.functions";
import { RecordInterface } from "src/shared/interfaces/record.interface";

export enum AccountingEnum {
    REVENUE = 'Revenue',
    EXPENDITURE = 'Expenditure',
}
export interface AccountInterface extends RecordInterface {
    name: string,
    bankName: string,
    bankBranch: string,
    accountNumber: string,
    description: string,
    amount: number,
    accountType: AccountingEnum,
}


export interface AccountTransferInterface {
    fromAccount: string,
    toAccount: string,
    amount: number,
    // description: string,
}

export interface AccountSummaryInterface {
    accountId: string,
    accountType: AccountingEnum
    name: string,
    amount: number,
}

//   export interface InvoiceChartInterface {

//   }

export interface IncomeStatementInterface {
    startDate: string,
    stopDate: string,
    totalRevenue: number,
    totalExpenses: number,
    incomeAccounts: AccountSummaryInterface[],
    expenseAccounts: AccountSummaryInterface[],
    chart: any,
}

export enum DefaultAccountEnums {
    CASH_SALES = 'Cash-Sales',
    CREDIT_SALES = 'Credit-Sales',
    PURCHASES = 'purchases',
    PETTY_CASH = 'petty_cash',
    LIVESTOCK_SALES = 'livestock-sales',
    LIVESTOCK_PURCHASES = 'livestock-purchases',
    LIVESTOCK_DEATHS = 'livestock-deaths',
    FUNDS_RECEIVED = 'funds',
    INCOMING_REFUNDS = 'incoming-refunds',
    OUTGOING_REFUNDS = 'outgoing-refunds',
    MEMBERSHIP_FEES = 'Membership Fees'
}