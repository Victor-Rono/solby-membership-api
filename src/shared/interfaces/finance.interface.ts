/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";
import { ExpenseType } from "./expenses.interface";



// export interface BankAccountInterface extends RecordInterface {
export interface BankAccountInterface {
    userId: string,
    accountName: string,
    description?: string,
    type: 'organization' | 'user',
    bankName: string,
    bankBranch?: string,
    bankAccountNumber: string,
}

export interface BankBranchInterface {
    bank_id: number,
    name: string,
    code: string,
}

export interface BankInterface {
    id: number,
    name: string,
    paybill: string,
    branches: BankBranchInterface[],
}


export interface AdvanceOrderInterface extends RecordInterface {
    amount: number,
    type: ExpenseType,
    amountPaid: number,
    farmerId?: string,
    farmerSerialNumber?: string,
}

export interface AdvanceDetailsInterface extends AdvanceOrderInterface {
    name: string,
    phone: string,
    serialNumber: string;
}

// export interface PayrollInterface extends RecordInterface {

// }
// export interface PaymentAccountInterface extends RecordInterface {
//   userId: string,
//   type: 'organization' | 'user',
//   purpose: 'credit' | 'debit',
//   phone?: string,
//   bankName?: string,
//   bankBranch?: string,
//   bankAccountNumber?: string,
//   paypal: string,
// }

