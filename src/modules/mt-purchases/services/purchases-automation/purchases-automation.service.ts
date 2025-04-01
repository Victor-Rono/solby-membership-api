/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { PurchaseEventEnums } from './putchase-events.enum';
import { Mt_ItemsInterface, MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { generateUniqueId, resolveMultiplePromises } from 'victor-dev-toolbox';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { ProductInterface } from 'src/shared/interfaces/product.interface';
import { AccountingEnum, AccountInterface } from 'src/modules/accounting/accounting.interface';
import { prepareAccount } from 'src/shared/functions/accounting.functions';
import { LedgerInterface, LedgerTypeEnums } from 'src/shared/interfaces/ledger.interface';

@Injectable()
export class PurchasesAutomationService extends BaseAutomationService {
    constructor(
        // private sa
    ) {
        super();
    }

    @OnEvent(PurchaseEventEnums.PURCHASE_MADE)
    async purchaseMade(payload: { record: MT_SaleRecordInterface, organizationId: string, sale: MT_SaleInterface }) {
        // Save the sale record
        const { record, organizationId, sale } = payload;
        // this.updateAccountBalance(organizationId, sale);

        const { saleId, id, items, } = record;
        // const save = await this.databaseService.createItem({ id, itemDto: record, collection: DatabaseCollectionEnums.MT_SALE_ITEMS, organizationId });
        const save = await this.savePurchaseRecords({ organizationId, saleId, record })

        this.updateProductQuantities(organizationId, items)
    }

    private async savePurchaseRecords(payload: { organizationId: string, saleId: string, record: MT_SaleRecordInterface, }) {
        const { organizationId, saleId, record } = payload;
        const products = record.items;
        const promises: any[] = [];
        products.forEach(p => {

            p.id = generateUniqueId();
            p.invoiceId = saleId;
            promises.push(this.databaseService.createItem({ id: p.id, itemDto: p, collection: DatabaseCollectionEnums.PURCHASE_RECORDS, organizationId }))
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
        let difference = product.quantity + soldProduct.quantity;
        if (difference < 0) difference = 0;

        const data = { quantity: difference }
        const update = await this.databaseService.updateItem({ id: product.id, itemDto: data, collection: DatabaseCollectionEnums.PRODUCTS, organizationId });

        return update;
    }

    private async updateAccountBalance(organizationId: string, sale: MT_SaleInterface) {

        const { amountPaid, accountId, } = sale;

        const account: AccountInterface | null = await this.databaseService.getItem({ id: accountId, organizationId, collection: DatabaseCollectionEnums.ACCOUNTING });
        let id = account?.id || 'purchases';

        if (!account) {
            const account = prepareAccount({ id: 'purchases', name: 'Purchases', accountType: AccountingEnum.EXPENDITURE, amount: 0, description: 'Purchases Account', });
            const accountFromDB = await this.databaseService.createItem({ id: account.id, itemDto: account, collection: DatabaseCollectionEnums.ACCOUNTING, organizationId });
            id = accountFromDB.id;
            // notify users when new account created
        };
        const amount = account?.amount || 0;
        const paid = amount - amountPaid;
        const data = { amount: paid }

        const update = await this.databaseService.updateItem({ id, itemDto: data, collection: DatabaseCollectionEnums.ACCOUNTING, organizationId });
        const saveToLedger = await this.saveToLedger({ organizationId, accountId, sale });
        return update;

    }

    private async saveToLedger(payload: { organizationId: string, accountId: string, sale: MT_SaleInterface }) {
        const { organizationId, accountId, sale } = payload;
        const type = (sale.saleType) as any as LedgerTypeEnums;
        const account: AccountInterface | null = await this.databaseService.getItem({ collection: DatabaseCollectionEnums.ACCOUNTING, id: accountId, organizationId });


        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type,
            amount: (sale.amountPaid) * -1,
            description: type,
            accountId,
            accountName: account?.name || 'N/A',
            buyerId: sale.buyerId,
            sellerId: sale.sellerId,
            createdBy: "System",
        };
        const save = await this.databaseService.createItem({ id: ledger.id, itemDto: ledger, collection: DatabaseCollectionEnums.LEDGER, organizationId });
    }


    // private saveInvoice(organizationId:string, sale:)
}
