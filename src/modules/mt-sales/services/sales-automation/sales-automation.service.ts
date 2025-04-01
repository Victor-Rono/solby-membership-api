/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SalesEventsEnum } from './sales-events.enums';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { Mt_ItemsInterface, MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { ProductInterface } from 'src/shared/interfaces/product.interface';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { log } from 'console';
import { generateUniqueId } from 'src/database/database.functions';
import { AccountingEnum, AccountInterface } from 'src/modules/accounting/accounting.interface';
import { prepareAccount } from 'src/shared/functions/accounting.functions';
import { LedgerInterface, LedgerTypeEnums } from 'src/shared/interfaces/ledger.interface';

@Injectable()
export class SalesAutomationService extends BaseAutomationService {
    constructor(
        // private sa
    ) {
        super();
    }

    @OnEvent(SalesEventsEnum.SALE_MADE)
    async saleMade(payload: { record: MT_SaleRecordInterface, organizationId: string, sale: MT_SaleInterface }) {
        // Save the sale record
        const { record, organizationId, sale } = payload;
        // this.updateAccountBalance(organizationId, sale);

        const { saleId, id, items, } = record;
        const save = await this.saveSaleRecords({ organizationId, saleId, record })

        this.updateProductQuantities(organizationId, items)
    }



    private async saveSaleRecords(payload: { organizationId: string, saleId: string, record: MT_SaleRecordInterface, }) {
        const { organizationId, saleId, record } = payload;
        const products = record.items;
        const promises: any[] = [];
        products.forEach(p => {

            p.id = generateUniqueId();
            p.invoiceId = saleId;
            promises.push(this.databaseService.createItem({ id: p.id, itemDto: p, collection: DatabaseCollectionEnums.SALE_RECORDS, organizationId }))
        });
        const resolved = await resolveMultiplePromises(promises);
        return resolved;

    }

    private async updateProductQuantities(organizationId: string, soldProducts: Mt_ItemsInterface[]) {
        if (!soldProducts.length) return;
        const products: ProductInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.PRODUCTS });
        const promises: any[] = [];
        soldProducts.forEach(sold => {
            const promise = this.updateQuantityForSingePRoduct(organizationId, sold, products);
            promises.push(promise);
        })
        return resolveMultiplePromises(promises);

    }

    private async updateQuantityForSingePRoduct(organizationId: string, soldProduct: Mt_ItemsInterface, products: ProductInterface[]) {
        const product = products.find(p => p.id === soldProduct.productId);
        if (!product) return false;
        let difference = product.quantity - soldProduct.quantity;
        if (difference < 0) difference = 0;

        const data = { quantity: difference }
        const update = await this.databaseService.updateItem({ id: product.id, itemDto: data, collection: DatabaseCollectionEnums.PRODUCTS, organizationId });

        return update;
    }

    private async updateAccountBalance(organizationId: string, sale: MT_SaleInterface) {

        const { amountPaid, accountId, } = sale;

        const account: AccountInterface | null = await this.databaseService.getItem({ id: accountId, organizationId, collection: DatabaseCollectionEnums.ACCOUNTING });
        let id = account?.id;

        if (!account) {
            const account = prepareAccount({ id: 'sales', name: 'Sales', accountType: AccountingEnum.REVENUE, amount: 0, description: 'Sales Account', });
            const accountFromDB = await this.databaseService.createItem({ id: account.id, itemDto: account, collection: DatabaseCollectionEnums.ACCOUNTING, organizationId });
            id = accountFromDB.id;
        };
        const amount = account?.amount || 0;
        const paid = amount + amountPaid;
        const data = { amount: paid }

        const update = await this.databaseService.updateItem({ id: account.id, itemDto: data, collection: DatabaseCollectionEnums.ACCOUNTING, organizationId });
        const ledger = await this.saveToLedger({ organizationId, account, sale });
        return update;

    }

    private async saveToLedger(payload: { organizationId: string, account: AccountInterface, sale: MT_SaleInterface }) {
        const { organizationId, account, sale } = payload;
        const type = (sale.saleType) as any as LedgerTypeEnums;
        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type,
            amount: sale.amountPaid,
            description: type,
            accountId: account.id,
            saleId: sale.id,
            accountName: account.name,
            createdBy: 'system',
            buyerId: sale.buyerId,
            sellerId: sale.sellerId,
        };
        const save = await this.databaseService.createItem({ id: generateUniqueId(), itemDto: ledger, collection: DatabaseCollectionEnums.LEDGER, organizationId });
    }

    // private saveInvoice(organizationId:string, sale:)
}
