/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getRequest } from 'src/shared/functions/http.functions';
import { phoneNumberWithCountryCode } from 'src/shared/functions/phone-numbers.functions';
import { SMSInterface } from 'src/shared/interfaces/sms.interface';
import { prepareLancolaMessage } from './lancola-sms.functions';

@Injectable()
export class LancolaSmsService {


    async sendSMS(payload: SMSInterface) {
        return new Promise<any>(async (resolve, reject) => {
            const phoneNumber = phoneNumberWithCountryCode({ phoneNumber: payload.phone, countryCode: '254' });
            payload.phone = phoneNumber;
            const finalURL = prepareLancolaMessage(payload);


            getRequest(finalURL).then((response) => {

                resolve(response);
            });
        })

    }



}
