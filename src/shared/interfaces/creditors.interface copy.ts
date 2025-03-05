/* eslint-disable prettier/prettier */

import { PaymentIntervalEnum } from "./payment.interface";
import { RecordInterface } from "./record.interface";






export interface CreditorInterface extends RecordInterface {
    userId: string,
    name: string,
    email: string,
    phone: string,
    idNumber: string,
    balance?: number,
    paymentInterval: PaymentIntervalEnum,
    currency: string,
    deductions?: string[],
    allowances?: string[],
    bankName?: string,
    bankBranch?: string,
    accountNumber: number,
}
