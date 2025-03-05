/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";

export type ExpenseType = 'Farmer' | 'Transporter' | 'Employee';
export interface ExpenseInterface extends RecordInterface {
    userId: string;
    recipientUserId: string,
    expenseType: ExpenseType,
    amount: number,
    paidAmount: number,
}

// export interface InvoiceInterface extends RecordInterface {
//     id: string,
//     expenseId: string,
//     amount: number,
//     paidAmount: number,
//     recipientId: string,
//     expenseType: ExpenseType,
// }

export interface SupplyRecordInterface extends ExpenseInterface {
    farmerId: string,
    transporterId?: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    paidAmount: number,
    accepted?: boolean,
    processed?: boolean,

}
