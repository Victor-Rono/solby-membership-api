/* eslint-disable */
import { SubscriptionConfigInterface, SubscriptionInterface, SubscriptionTypeEnum } from "src/shared/interfaces/subscriptions.interface";
import { getEnumValues } from "victor-dev-toolbox";

enum DefaultSubscriptionIdsEnum {
    registration = 'registration',
    mseaMonthlySubscriptions = 'msea-monthly-subscriptions',


}

export const defaultSubscriptionIds: string[] = getEnumValues(DefaultSubscriptionIdsEnum);


export const DefaultSubscriptions: SubscriptionInterface[] = [
    {
        id: DefaultSubscriptionIdsEnum.registration,
        name: 'Registration',
        description: 'Registration Fees for new users',
        price: 250,
        type: SubscriptionTypeEnum.ONE_TIME,
        createdBy: "SYSTEM",
    },
    {
        id: DefaultSubscriptionIdsEnum.mseaMonthlySubscriptions,
        name: 'Monthhly Membership Subscription',
        description: 'Monthly Membership Subscription',
        price: 250,
        type: SubscriptionTypeEnum.MONTHLY,
        createdBy: "SYSTEM",
    },
];

export const subscriptionConfigId = 'config';

export const DefaultSubscriptionConfig: SubscriptionConfigInterface = {
    monthly: 1,
    yearly: '',
    weekly: 'Monday',

}

