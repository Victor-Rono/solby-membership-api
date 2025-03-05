/* eslint-disable prettier/prettier */
import { InvoiceEnums } from "src/modules/invoices/invoices.interface";

export enum PaymentMethodsEnum {
    M_PESA = 'M-PESA',
    BANK_TRANSFER = 'BANK-TRANSFER',
    // CHEQUE = 'CHEQUE',
    // CASH = 'CASH',
    // CREDIT_SALE = 'CREDIT SALE',
    // COMPLEMENTARY_SALE = 'COMPLEMENTARY SALE',
    NONE = 'NONE',
}

// export enum PaymentIntervalEnum {
//     MONTHLY = 'monthly',
//     BI_WEEKLY = 'Every 2 weeks',
//     DAILY = 'Daily',
//     // HOURLY = 'hourly',
//     WEEKLY = 'weekly',
// }

export enum PaymentIntervalEnum {
    MONTHLY = 'monthly',
    DAILY = 'daily',
    HOURLY = 'hourly',
    WEEKLY = 'weekly',
    BI_WEEKLY = 'Every 2 weeks',
}


export enum MT_Transaction_Enums {
    CASH = InvoiceEnums.CASH_SALE,
    CREDIT = InvoiceEnums.CREDIT_SALE,
}