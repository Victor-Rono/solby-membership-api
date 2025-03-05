/* eslint-disable prettier/prettier */
import { InvoiceEnums } from "src/modules/invoices/invoices.interface";
import { MT_Transaction_Enums } from "./payment.interface";
import { RecordInterface } from "./record.interface";

export enum LedgerTypeEnums {
    FUNDS_ADDED = 'FUNDS ADDED',
    FUNDS_TRANSFER = 'FUNDS TRANSFER',
    PETTY_CASH_EXPENSE = 'PETTY CASH EXPENSE',
    AMOUNT_UPDATED = 'AMOUNT ADDED',
    AMOUNT_DEDUCTED = 'AMOUNT DEDUCTED',
    EXPENSE ='EXPENSE',
    REVENUE = 'REVENUE',
}

export interface LedgerInterface extends RecordInterface {
    type: LedgerTypeEnums | MT_Transaction_Enums,
    amount: number,
    description: string,
    accountId: string,
    saleId?: string,
    accountName: string,
    ref?: string,
    buyerId: string,
    sellerId: string,
}

export interface LedgerBreakdownInterface {
    expenses: number,
    revenues: number,
    netRevenue: number,
    expenseTransactions: number,
    revenueTransactions: number,
    totalTransactions: number,
}