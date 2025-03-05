/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseService } from 'src/modules/base/base.service';
import { PettyCashEventsEnum } from './petty-cash-events.enum';

@Injectable()
export class PettyCashAutomationService extends BaseService<any, any, any, any> {

    @OnEvent(PettyCashEventsEnum.PETY_CASH_TRANSACTION)
    async handlePettyCashTransaction(data: any) {
        // saving to ledger
    }
}
