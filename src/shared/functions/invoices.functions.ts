/* eslint-disable prettier/prettier */
import { InvoiceCalculationInterface, InvoiceInterface } from "src/modules/invoices/invoices.interface";
import { getStartOfDay } from "./date-time.functions";
import { getFieldValuesFromArray, getTotalForField } from "victor-dev-toolbox";

export function validateInvoiceFields(invoice: Partial<InvoiceInterface>): InvoiceInterface {
    const today = new Date().toISOString(); // Format as YYYY-MM-DD
    const items = invoice.items || [];
    const totalAmount = getTotalForField(items, 'total') || 0;


    if (typeof invoice.totalAmount !== 'number') {
        invoice.totalAmount = totalAmount;
    }

    if (typeof invoice.amountPaid !== 'number') {
        invoice.amountPaid = 0;
    }

    if (typeof invoice.currency !== 'string') {
        invoice.currency = 'KES'
    }

    if (typeof invoice.day !== 'string') {
        invoice.day = getStartOfDay(); // Set to today if not provided
    }

    return invoice as InvoiceInterface; // Cast to full InvoiceInterface after validation
}

/* eslint-disable prettier/prettier */
export function totalForAllInvoices(invoices: InvoiceInterface[]): InvoiceCalculationInterface {
    let totalDue = 0;
    let amountPaid = 0;
    let totalAmount = 0;
    invoices.forEach(invoice => {
        const calculation = totalForSingleInvoice(invoice);
        totalDue += calculation.totalDue;
        amountPaid += calculation.amountPaid;
        totalAmount += calculation.totalAmount;

    });

    return {
        totalDue,
        amountPaid,
        totalAmount
    };

}

export function totalForSingleInvoice(invoice: InvoiceInterface): InvoiceCalculationInterface {
    // const { totalAmount, amountPaid } = invoice;
    const totalAmount = invoice.totalAmount || 0;
    const amountPaid = invoice.amountPaid || 0;
    const totalDue = (totalAmount) - amountPaid;
    return {
        totalAmount,
        amountPaid,
        totalDue
    };
}

export function getDescriptionForInvoice(invoice: InvoiceInterface): string {
    const invoiceType = invoice.invoiceType;
    if (invoice.items.length) {
        const names: string[] = getFieldValuesFromArray('name', invoice.items);
        let productList = '';
        if (names.length == 2) {
            productList = `for ${names.join(' and ')}`;
        } else if (names.length > 2) {
            const lastItem = names.pop();
            productList = `for ${names.join(', ')} and ${(names.length - 2)} other items`;
        } else {
            productList = `for ${names.join(', ')}`;
        }

        const descriotion = `${invoiceType} invoice ${productList}`;
        return descriotion;

    }
}