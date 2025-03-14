/* eslint-disable prettier/prettier */
export interface SMSInterface {
    organizationId: string,
    phone: string;
    message: string;
    response?: any;
}

export enum SMSEventsEnum {
    SED_TEST_SMS = 'Send Test Sms'
}