/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
import { SMSEventsEnum, SMSInterface } from 'src/shared/interfaces/sms.interface';
import { LancolaSmsService } from 'src/integrations/lancola-sms/services/lancola-sms/lancola-sms.service';
import { DatabaseService } from 'src/database/database.service';
import { generateUniqueId } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class SmsService {

    constructor(
        private SMS_service: LancolaSmsService,
        private databaseService: DatabaseService,
        private eventemitter: EventEmitter2
    ) { }

    async sendSMS(payload: SMSInterface) {
        const sendSMS = await this.SMS_service.sendSMS(payload);
        // payload.response = sendSMS;
        this.saveSMS(payload);
        return sendSMS;
    }

    private async saveSMS(payload: SMSInterface) {
        const id = generateUniqueId();
        payload.id = id;
        const save = await this.databaseService.createItem({
            id,
            itemDto: payload,
            collection: DatabaseCollectionEnums.SMS,
            organizationId: payload.organizationId,
        })
    }

    @OnEvent(SMSEventsEnum.SEND_SMS)
    sendTestsSms(sms: SMSInterface) {
        // const message: SMSInterface = {
        //     organizationId: 'AAAA',
        //     phone: '0795349039',
        //     message: 'Test SMs'
        // };
        const send = this.sendSMS(sms);

    }

}
