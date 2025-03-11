/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { take } from 'rxjs';
@Injectable()
export class CronService {
    constructor() { }

    @Cron(CronExpression.EVERY_5_SECONDS)
    handleCron() {

        // Implement your logic here
    }

    @Cron('0 0 * * *') // Run every day at midnight
    // @Cron(CronExpression.EVERY_3_HOURS)
    handleDailyCron() {

    }


}
