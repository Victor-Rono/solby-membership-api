/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers } from '@nestjs/common';
import { prepareRequest } from 'src/modules/base/base.controller';
import { SmsService } from 'src/modules/notifications/sms/services/sms/sms.service';

@Controller('sms')
export class SmsController {
    constructor(
        private smsService: SmsService,
    ) { }

    @Post('')
    async sendSMS(@Headers() headers: any, @Body() req: any) {
        const data = prepareRequest({ headers, payload: req });
        const { organizationId, payload } = data;
        const { phone, message } = payload;
        return this.smsService.sendSMS({ organizationId: data.organizationId, phone, message });
    }
}
