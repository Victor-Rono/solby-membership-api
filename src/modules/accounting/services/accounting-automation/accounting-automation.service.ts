/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { AccountEventsEnum } from './accounting-events.enums';
import { LedgerInterface, LedgerTypeEnums } from 'src/shared/interfaces/ledger.interface';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { generateUniqueId } from '../../../../database/database.functions';
import { AccountInterface } from '../../accounting.interface';

@Injectable()
export class AccountingAutomationService extends BaseService<any, any, any, any> {

    @OnEvent(AccountEventsEnum.ADD_FUNDS)
    async addFunds(payload: { organizationId: string, accountId: string, amount: number, description: string }) {
        const { organizationId, accountId, amount, description } = payload;
        const account: AccountInterface | null = await this.databaseService.getItem({ collection: DatabaseCollectionEnums.ACCOUNTING, id: accountId, organizationId });
        if (!organizationId) return;
        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            amount,
            description: description || 'Funds Added',
            accountId,
            type: LedgerTypeEnums.FUNDS_ADDED,
            accountName: account?.name || 'N/A',
            createdBy: 'System',
            buyerId: 'N/A',
            sellerId: 'N/A',
        };
        const save = await this.databaseService.createItem({ id: ledger.id, collection: DatabaseCollectionEnums.LEDGER, itemDto: ledger, organizationId });
    }

    @OnEvent(AccountEventsEnum.TRANSFER_FUNDS)
    async saveTransfersToLedger(payload: { organizationId: string, fromAccount: string, toAccount: string, amount: number }) {
        const accounts = await this.databaseService.getAllItems({ organizationId: payload.organizationId, collection: DatabaseCollectionEnums.ACCOUNTING, });
        const from = accounts.find(account => account.id === payload.fromAccount);
        const to = accounts.find(account => account.id === payload.toAccount);

        const description = `Transfer from ${from.name} Account to ${to.name} Account`;
        const fromLedger: LedgerInterface = {
            id: generateUniqueId(),
            type: LedgerTypeEnums.FUNDS_TRANSFER,
            accountId: payload.fromAccount,
            accountName: from.name,
            amount: -payload.amount,
            description,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            sellerId: to.id,
            buyerId: from.id,
        }

        const toLedger: LedgerInterface = {
            id: generateUniqueId(),
            type: LedgerTypeEnums.FUNDS_TRANSFER,
            accountId: payload.toAccount,
            accountName: to.name,
            amount: payload.amount,
            description,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            buyerId: to.id,
            sellerId: from.id,
        }

        this.databaseService.createItem({ id: fromLedger.id, organizationId: payload.organizationId, collection: DatabaseCollectionEnums.LEDGER, itemDto: fromLedger });
        this.databaseService.createItem({ id: toLedger.id, organizationId: payload.organizationId, collection: DatabaseCollectionEnums.LEDGER, itemDto: toLedger });

    }


}
