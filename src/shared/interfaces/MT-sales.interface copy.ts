/* eslint-disable prettier/prettier */
import { InvoiceInterface, InvoiceItemsInterface, } from 'src/modules/invoices/invoices.interface';
import { MT_Transaction_Enums } from "./payment.interface";
import { RecordInterface } from "./record.interface";



export interface MT_SaleInterface extends InvoiceInterface {
    saleType: MT_Transaction_Enums
}

export interface Mt_ItemsInterface extends InvoiceItemsInterface {
    total: number,
    productId: string,
}

export interface MT_SaleRecordInterface extends RecordInterface {
    saleId: string,
    items: Mt_ItemsInterface[],
}
