/* eslint-disable prettier/prettier */
export interface SMSInterface {
    id?: string,
    organizationId: string,
    phone: string;
    message: string;
    response?: any;
}

export enum SMSEventsEnum {
    SEND_SMS = 'Send Sms',

}