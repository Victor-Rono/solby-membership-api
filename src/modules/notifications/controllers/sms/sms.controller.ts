/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { SmsService } from 'src/modules/notifications/sms/services/sms/sms.service';
import { SMSEventsEnum } from 'src/shared/interfaces/sms.interface';

@Controller('sms')
export class SmsController {
    constructor(
        private eventEmitter: EventEmitter2,
    ) { }

    @Post('')
    async sendSMS(@Headers() headers: any, @Body() req: any) {
        const data = prepareRequest({ headers, payload: req });
        const { organizationId, payload } = data;
        const { phone, message } = payload;

        return this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, { organizationId: data.organizationId, phone, message });
    }
}
