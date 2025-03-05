/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";


export type PayrollRecipientType = 'employee' | 'organization' | 'debtor' | 'other' | 'creditor';

export interface PayrollRecipientInterface extends RecordInterface {
    uniqueId?: string,
    name: string,
    phone: string,
    email: string,
    type: PayrollRecipientType,
    bankCode: string,
    accountNumber: string,
}
export interface PayrollAmountInterface extends PayrollRecipientInterface {
    totalCredit: number,
    totalDebts: number,
    amountToPay: number,
}


export interface DeductionInterface {
    name: string,
    deductionType: 'MANDATORY' | 'OPTIONAL',
    calculatedBy: 'FIXED' | 'PERCENTAGE' | 'INCOME_BRACKET',
    amount: number,
    incomeBrackets?: IncomeBracketInterface[],
}

export interface AllowanceInterface {
    name: string,
    deductionType: 'MANDATORY' | 'OPTIONAL',
    calculatedBy: 'FIXED' | 'PERCENTAGE' | 'INCOME_BRACKET',
    amount: number,
    incomeBrackets?: IncomeBracketInterface[],
}


export interface IncomeBracketInterface {
    from: number,
    to: number,
    amount: number,
}


export interface PayrollCalculationsInterface {
    quantity: number,
    grossPay: number,
    transport: number,
    advance: number,
    netPay: number,
    agrovet: number,
}

export interface PayrollInterface {
    serialNumber: string,
    // name: string,
    idNumber: string,
    quantity: number,
    grossPay: number,
    advance: number,
    agrovet: number,
    transport: number,
    netPay: number,
    bankName: string,
    bankCode: string,
    accountNumber: string,
    tCode?: string,
    branch: string,
    sign?: string,
}
export interface FarmerPayrollInterface extends PayrollInterface {
    farmerName: string,
    farmerPhone: string,
    farmerIdNumber: string,
    farmerBankCode: string,
    farmerBankName: string,
    farmerAccountNumber: string,

};

export interface PayslipInterface {
    netPay: number,
    grossPay: number,
    advance: number,
    agrovet: number,
    transport: number,
    milkRecords: any[],
    advanceRecords: any[],
    agrovetRecords: any[],
}

