/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface GlobalSUpplierInterface extends RecordInterface {
    name: string,
    description: string,
    email: string,
    phone: string,
    country: string,
    city: string,
    currency: string,
    ownerId: string,
    website?: string,
    location?: string,
}


export interface ContactSupplierInterface extends RecordInterface {
    sender: string,
    recipient: string,
    message: string,
    supplierName: string,
    senderName: string,
    replies: SupplierChatInterface[],
}
export interface SupplierChatInterface {
    sender: string,
    message: string,
}