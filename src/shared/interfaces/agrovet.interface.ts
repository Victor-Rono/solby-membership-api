/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";


export interface AgrovetInterface extends RecordInterface {
    // userId: string,
    name?: string,
    email?: string,
    phone?: string
    // salary: number,
    // location: string,
    currency: string,
    paymentMethod: string,
    deductions: string[],
    allowances: string[],
    bankId: number,
    bankBranch: string,
    bankCode: string,
}

export interface AgrovetProductInterface extends RecordInterface {
    agrovetId: string,
    name: string,
    quantity: number,
    description?: string,
    buyingPrice: number,
    sellingPrice: number,
}

export interface AgrovetSaleRecordInterface extends RecordInterface {
    farmerId?: string,
    transporterId?: string,
    products: AgrovetProductInterface[],
    totalAmount: number,
    amountPaid: number,
}