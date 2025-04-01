/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceUserTypeEnum } from 'src/modules/invoices/invoices.interface';
import { MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { generateUniqueId } from 'victor-dev-toolbox';
import { PurchaseEventEnums } from '../purchases-automation/putchase-events.enum';
import { CreditorInterface } from 'src/shared/interfaces/creditors.interface';
import { getDescriptionForInvoice } from 'src/shared/functions/invoices.functions';

@Injectable()
export class MtPurchasesService extends BaseService<any, any, any, any> {
    constructor() {
        super();
    }


    override async getAll(organizationId: string): Promise<MT_SaleInterface[]> {
        const fields = { field: 'category', value: InvoiceCategoryEnum.PURCHASE }
        const sales = await this.getByField({ organizationId, payload: fields });

        return sales
    }

    async purchase(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { sale, products } = payload;
        const item = sale as MT_SaleInterface;
        item.items = products;
        item.category = InvoiceCategoryEnum.PURCHASE
        item.invoiceType = InvoiceEnums.PURCHASE,
            item.buyerId = organizationId;
        // item.sellerId
        const seller: CreditorInterface = await this.databaseService.getItem({ id: item.sellerId || 'none', organizationId, collection: DatabaseCollectionEnums.CREDITORS });
        if (seller) {
            item.sellerId = seller.id;
            item.sellerName = seller.name;
            item.email = seller.email;
            item.sellerPhone = seller.phone;
        }

        const id = item.id || generateUniqueId();
        item.id = id;

        const invoice = await this.addCreditorDetails(organizationId, item);
        const description = getDescriptionForInvoice(invoice);
        invoice.description = description;
        invoice.userType = InvoiceUserTypeEnum.CREDITOR;

        const saveSale = await this.create({ id, organizationId, payload: invoice });

        const record: MT_SaleRecordInterface = {

            saleId: saveSale.id,
            id: generateUniqueId(),
            items: products,
            createdBy: "SYSTEM"
        };

        this.eventEmitter.emit(PurchaseEventEnums.PURCHASE_MADE, { record, organizationId, sale: saveSale });
        return saveSale;

    }


    private async addCreditorDetails(organizationId: string, invoice: InvoiceInterface): Promise<InvoiceInterface> {
        const creditor: CreditorInterface = await this.databaseService.getItem({ id: invoice.sellerId || 'none', organizationId, collection: DatabaseCollectionEnums.CREDITORS });
        if (creditor) {
            invoice.sellerId = creditor.id;
            invoice.sellerName = creditor.name;
            invoice.email = creditor.email;
            invoice.sellerPhone = creditor.phone;
        }
        return invoice;
    }
}


