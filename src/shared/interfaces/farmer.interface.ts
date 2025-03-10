/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";
import { PaymentIntervalEnum } from "./payment.interface";
import { InvoiceInterface } from "src/modules/invoices/invoices.interface";
import { MemberInterface } from "./members.interface";

// export interface FarmerInterface extends RecordInterface {
//     userId: string,
//     name?: string,
//     email?: string,
//     phone?: string
//     salary: number,
//     location: string,
//     // paymentType: PaymentType,
//     currency: string,
//     paymentMethod: string,
//     deductions: string[],
//     allowances: string[],
//     bankName?: string,
//     bankId?: string,
//     bankBranch?: string,
//     accountNumber?: string,
//     tCode?: string,
// }

export interface FarmersDashboardInterface {
    pendingInvoices: number,
    totalPendingAmount: number,
    totalPurchases: number,

    totalSales: number,
    saleInvoices: InvoiceInterface[],
    purchaseInvoices: InvoiceInterface[],

    purchaseTransactions: number,
    saleTransactions: number,
    outStandingPayment: number,

    highestSale: number,
    totalLoans: number,
    totalFarmers: number,
    salesBreakdown: any,
}

export interface FarmerInterface extends MemberInterface {
    userId: string,
    // name: string,
    // email: string,
    // phone: string,
    // idNumber: string,
    // balance?: number,
    // paymentInterval: PaymentIntervalEnum,
    // currency: string,
    // deductions?: string[],
    // allowances?: string[],
    // bankName?: string,
    // bankBranch?: string,
    // accountNumber: number,
    // location?: string,
    // bankId?: string,
}