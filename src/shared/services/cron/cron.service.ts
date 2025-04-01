/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { take } from 'rxjs';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { MemberEventsEnum } from 'src/modules/members/services/members-automation/members-events.enum';
@Injectable()
export class CronService extends BaseAutomationService {
    constructor() {
        super();
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    handleCron() {

        // Implement your logic here
    }

    @Cron('0 0 * * *') // Run every day at midnight
    // @Cron(CronExpression.EVERY_3_HOURS)
    handleDailyCron() {

    }

    @Cron('30 9 * * *') // Runs every day at 9:30 AM
    handleMorningCron() {
        this.eventEmitter.emit(MemberEventsEnum.SUBSCRIPTIONS);
    }


}
