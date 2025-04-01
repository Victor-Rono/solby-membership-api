/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { DefaultSubscriptions, subscriptionConfigId } from '../../data/subscriptions.data';

@Injectable()
export class SubscriptionsService extends BaseService<any, any, any, any> {
    constructor() {
        super();
    }

    // override async deleteRecord(payload: DBRequestInterface): Promise<any> {
    //     const { id } = payload;
    //     const find = DefaultSubscriptions.find((item) => item.id === id);
    //     if (find) {
    //         return false;
    //     }
    //     return super.deleteRecord(payload);
    // }

    async saveSubscriptionConfig(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const collection = DatabaseCollectionEnums.SUBSCRIPTIONS_CONFIG;
        const id = subscriptionConfigId;
        const get = await this.databaseService.getItem({ id, organizationId, collection });
        if (get) {
            return this.databaseService.updateItem({ id, organizationId, collection, itemDto: payload });
        } else {
            return this.databaseService.createItem({ id, organizationId, collection, itemDto: payload });
        }
    }

    async getSubscriptionConfig(request: DBRequestInterface) {
        const { organizationId } = request;
        const collection = DatabaseCollectionEnums.SUBSCRIPTIONS_CONFIG;
        const id = subscriptionConfigId;
        const get = await this.databaseService.getItem({ id, organizationId, collection });

        if (get) {
            return get;
        }
        return null;
    }

}