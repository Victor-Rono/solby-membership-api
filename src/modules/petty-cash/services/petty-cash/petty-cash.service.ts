/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { DatabaseCollectionEnums } from '../../../../database/database.interface';
import { prepareAccount } from 'src/shared/functions/accounting.functions';
import { AccountingEnum } from 'src/modules/accounting/accounting.interface';
import { DateRangeInterface, generateUniqueId } from 'victor-dev-toolbox';
import { LedgerInterface, LedgerTypeEnums } from 'src/shared/interfaces/ledger.interface';
import { PettyCashInterface, PettyCashTransactionInterface } from 'src/shared/interfaces/petty-cash.interface';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceUserTypeEnum, PurchaseTypeEnum } from 'src/modules/invoices/invoices.interface';
import { TenantInterface } from 'src/modules/tenants/interfaces/tenants.interface';

@Injectable()
export class PettyCashService extends BaseService<any, any, any, any> {
    constructor() {
        super()
    }

    override async create(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { recipientName, recipientContact, amount, description } = payload;
        // subtract balance from petty cash account
        const account = await this.getPettyCashAccount({ organizationId });
        const newAmount = account.amount - amount;
        const save = await this.databaseService.updateItem({ organizationId, id: account.id, itemDto: { amount: newAmount }, collection: DatabaseCollectionEnums.ACCOUNTING });
        // ledger
        const id = generateUniqueId();
        const ledger: LedgerInterface = {
            id,
            type: LedgerTypeEnums.PETTY_CASH_EXPENSE,
            accountId: account.id,
            accountName: account?.name || 'N/A',
            amount: (amount * -1),
            description,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            buyerId: organizationId,
            sellerId: id,
        }
        const saveLedger = await this.databaseService.createItem({ id, organizationId, collection: DatabaseCollectionEnums.LEDGER, itemDto: ledger });
        const savePettyCash = await super.create({ organizationId, payload });
        return savePettyCash;
        // this.eventEmitter.emit()

    }


    async getPettyCashByDateRange(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { startDate, stopDate } = payload;
        const petyCash = await this.databaseService.getItemsByDateRange({
            collection: this.collection,
            organizationId,
            startDate,
            stopDate
        });
        return petyCash;
    }

    async getPettyCashAccount(request: DBRequestInterface) {
        const { organizationId } = request;
        const id = 'petty_cash';
        const pettyCashAccount = await this.databaseService.getItem({ id, organizationId, collection: DatabaseCollectionEnums.ACCOUNTING });
        if (!pettyCashAccount) {
            return this.createPettyCashAccount({ id, organizationId });
        }
        return pettyCashAccount;
    }

    private async createPettyCashAccount(payload: { id: string, organizationId: string }) {
        const { id, organizationId } = payload;
        const account = prepareAccount({ id, name: "Petty Cash", accountType: AccountingEnum.EXPENDITURE });
        const create = await this.databaseService.createItem({ id, collection: DatabaseCollectionEnums.ACCOUNTING, itemDto: account, organizationId });
        return create;
    }

    async getPettyCashAsInvoices(organizationId: string, dateRange: DateRangeInterface) {
        const pettyCash = await this.getByDateRange({ organizationId, payload: dateRange });
        const invoices: InvoiceInterface[] = await this.convertPettyCashToInvoices(organizationId, pettyCash);
        return invoices;
    }

    private async convertPettyCashToInvoices(organizationId: string, pettyCash: PettyCashTransactionInterface[]): Promise<InvoiceInterface[]> {
        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }
        const invoices: InvoiceInterface[] = pettyCash.map(p => { return this.processPettyCashToInvoice(organization, p) });
        return invoices;
    }


    private processPettyCashToInvoice(organization: TenantInterface, pettyCash: PettyCashTransactionInterface) {

        const invoice: InvoiceInterface = {
            id: generateUniqueId(),
            name: pettyCash.recipientName,
            description: pettyCash.description,
            invoiceType: InvoiceEnums.PURCHASE,
            items: [],
            totalAmount: pettyCash.amount,
            amountPaid: pettyCash.amount,
            currency: 'KES',
            buyerId: pettyCash.recipientContact,
            sellerId: organization.id,
            accountId: 'petty_cash',
            day: pettyCash.createdAt,
            category: InvoiceCategoryEnum.PURCHASE,
            buyerName: pettyCash.recipientName,
            sellerName: organization.shortName,
            subscription: false,
            buyerPhone: pettyCash.recipientContact,
            sellerPhone: organization.phone,
            createdAt: pettyCash.createdAt,
            createdBy: pettyCash.createdBy,
            email: pettyCash.recipientContact,
            userType: InvoiceUserTypeEnum.CREDITOR,
        }
        return invoice;
    }


}
