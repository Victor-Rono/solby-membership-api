/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface SaleInterface extends RecordInterface {
    saleId: string,
    productId: string,
    quantity: any,
    productName?: string,
    buyingPrice?: string,
    price: number,
}

export interface SaleRecordInterface extends RecordInterface {
    id: string;
    uniqueId?: string;
    buyerId: string,
    sellerId: string,
    buyerName: string;
    sellerName: string;
    buyerPhone: string;
    quantity: number;
    totalAmount: number;
    paidAmount: number;
    paymentMethod?: string;
    buyingPrice?: number,
    bankName?: string;
    bankBranch?: string;
    chequeId?: string;
    transactionId?: string;
    complementarySaleDescription?: string;
    dueDate?: string;
}

export interface ProductSaleInterface {
    id?: string,
    productId: string,
    quantity: number,
    totalAmount: number,
    createdAt?: string,
};
