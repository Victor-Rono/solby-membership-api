/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
import { SMSInterface } from 'src/shared/interfaces/sms.interface';
import { LancolaSmsService } from 'src/integrations/lancola-sms/services/lancola-sms/lancola-sms.service';
import { DatabaseService } from 'src/database/database.service';
import { generateUniqueId } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
@Injectable()
export class SmsService {

    constructor(
        private SMS_service: LancolaSmsService,
        private databaseService: DatabaseService,
    ) { }

    async sendSMS(payload: SMSInterface) {
        const sendSMS = await this.SMS_service.sendSMS(payload);
        // payload.response = sendSMS;
        this.saveSMS(payload);
        return sendSMS;
    }

    private async saveSMS(payload: SMSInterface) {
        const save = await this.databaseService.createItem({
            id: generateUniqueId(),
            itemDto: payload,
            collection: DatabaseCollectionEnums.SMS,
            organizationId: payload.organizationId,
        })
    }

}
