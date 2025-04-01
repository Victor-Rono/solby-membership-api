/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { AccountInterface } from 'src/modules/accounting/accounting.interface';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { LedgerTypeEnums, LedgerInterface } from 'src/shared/interfaces/ledger.interface';
import { MT_ExpenseInterface } from 'src/shared/interfaces/MT-expenses.interface';
import { MT_SaleInterface } from 'src/shared/interfaces/MT-sales.interface';
import { generateUniqueId } from 'victor-dev-toolbox';

@Injectable()
export class MtExpensesAutomationService extends BaseAutomationService {
    constructor(
    ) {
        super();
    }

    private async saveToLedger(payload: { organizationId: string, expense: MT_ExpenseInterface, sale: MT_SaleInterface }) {
        const { organizationId, expense, sale } = payload;
        const type = (sale.saleType) as any as LedgerTypeEnums;
        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type,
            amount: sale.amountPaid,
            description: type,
            accountId: expense.id,
            saleId: sale.id,
            accountName: expense.categoryName,
            createdBy: 'system',
            buyerId: sale.buyerId,
            sellerId: sale.sellerId,
        };
        const save = await this.databaseService.createItem({ id: generateUniqueId(), itemDto: ledger, collection: DatabaseCollectionEnums.LEDGER, organizationId });
    }

}
