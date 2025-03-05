/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";


export type PaymentType = 'monthly' | 'daily' | 'hourly';

export interface EmployeeInterface extends RecordInterface {
    userId: string,
    name?: string,
    email?: string,
    phone?: string
    salary: number,
    paymentType: PaymentType,
    currency: string,
    paymentMethod: string,
    deductions: string[],
    allowances: string[],
    bankName?: string,
    bankBranch?: string,
}
