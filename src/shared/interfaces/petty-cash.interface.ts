/* eslint-disable prettier/prettier */
import { RecordInterface } from "./record.interface";

export interface PettyCashInterface {
    id: string;
    transactionDate: string;
    accountId: string;
    invoiceNumber: string;
    payee: string;
    description: string;
    amount: number;
    createdAt: any;
    createdBy: string;
}

export interface PettyCashTransactionInterface extends RecordInterface {
    recipientName: string;
    recipientContact: string;
    amount: number;
    description: string;
    // invoiceId: string;
}
