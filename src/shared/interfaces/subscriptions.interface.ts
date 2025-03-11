/* eslint-disable prettier/prettier */

import { RecordInterface } from "./record.interface";

export enum SubscriptionTypeEnum {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
    WEEKLY = 'WEEKLY',
    ONE_TIME = 'ONE TIME',

}

export interface SubscriptionInterface extends RecordInterface {
    name: string;
    description: string;
    type: SubscriptionTypeEnum
    price: number,

}


export interface SubscriptionConfigInterface {
    monthly: number,
    yearly: string,
    weekly: string,
}
