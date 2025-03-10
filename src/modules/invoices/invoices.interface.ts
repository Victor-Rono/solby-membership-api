/* eslint-disable prettier/prettier */
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { RecordInterface } from "src/shared/interfaces/record.interface";

export enum InvoiceEnums {
    CREDIT_SALE = 'Credit Sale',
    CASH_SALE = 'Cash Sale',
    PURCHASE = 'Purchase Order',
    REGISTRATION_FEE = 'Registration Fee',
    SUBSCRIPTION = 'Subscription',
    // EXPENDITURE = 'Expenditure',
    // PAYMENT = 'Payment',
    // LOAN = 'Loan',

}

export enum InvoiceUserTypeEnum {
    CREDITOR = 'creditor',
    DEBTOR = 'debtor',
    MEMBER = 'member',
    FARMER = 'farmer',
    UNKNOWN = 'unknown',
}


export enum PurchaseTypeEnum {
    FEEDS = 'Feeds',
    PRODUCTS = 'Products',
}


export interface InvoiceItemsInterface {
    id: string,
    productId?: string,
    name: string,
    quantity: number,
    unitPrice: number,
    total: number,
    day: string,

    description?: string,
    buyingPrice?: number,
    invoiceId?: string,
    createdAt?: string,
    imageURLs?: string[],
}
export enum InvoiceCategoryEnum {
    SALE = 'Sale',
    PURCHASE = 'Purchase',

}
export interface InvoiceInterface extends RecordInterface {
    name: string,
    description: string,
    invoiceType: InvoiceEnums,
    items: InvoiceItemsInterface[],
    totalAmount: number,
    amountPaid: number,
    currency: string,
    buyerId: string,
    sellerId: string,
    accountId: string,
    day: string,
    category: InvoiceCategoryEnum,
    buyerName: string,
    sellerName: string,
    userType: InvoiceUserTypeEnum
    subscription?: boolean,
    preventEdit?: boolean,
    buyerPhone?: string,
    sellerPhone?: string,
    purchaseType?: PurchaseTypeEnum,
    email: string,

}

export interface InvoiceCalculationInterface {
    totalAmount: number,
    amountPaid: number,
    totalDue: number,
}



export interface ProcessInvoiceInterface {
    amount: number,
    organizationId: string,
}

export interface ProcessMultipleInvoicesInterface extends ProcessInvoiceInterface {
    invoiceIds: string[],
}

export interface PayForInvoicesInterface extends ProcessInvoiceInterface {
    invoices: InvoiceInterface[],
}



export interface ProcessUserInvoiceInterface extends ProcessInvoiceInterface {
    userId: string,
    invoiceType: InvoiceEnums,
}

export interface InvoiceAccountsInterface {
    totalAmount: number;
    amountPaid: number;
    balanceLeft: number;
}

export interface InvoiceRevenueInterface {
    customerName: string,
    customerId: string,
    invoiceType: InvoiceEnums,
    comingDue: InvoiceStatsInterface,
    thirtyToSixtyDays: InvoiceStatsInterface,
    sixtyToNinetyDays: InvoiceStatsInterface,
    aboveNinetyDays: InvoiceStatsInterface,
    totalDebits: number,
    totalCredits: number,
    balance: number,

}

export interface InvoiceStatsInterface {
    totalAmount: number,
    numberOfInvoices: number,
    totalDebits: number,
    totalCredits: number,
}


export interface InvoiceParticipantInterface { name: string, phone: string, email: string }

export interface InvoiceDetailsInterface {
    from: InvoiceParticipantInterface,
    to: InvoiceParticipantInterface,
    invoice: InvoiceInterface | null,
    organization: OrganizationInterface
}