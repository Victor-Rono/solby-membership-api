/* eslint-disable prettier/prettier */
import { Injectable, Global, BadRequestException } from "@nestjs/common";
import { RtdbService } from "src/integrations/firebase/services/rtdb/rtdb.service";
import { checkIfExistsInterface, DatabaseCollectionEnums, DBRequestInterface, FieldValueInterface, GetAllItemsInterface, GetByIdInterface, MultipleFieldQueryInterface, MultipleFieldRequestInterface, QueryCollectionInterface, UpdateDBInterface } from "./database.interface";
import { generateUniqueId, getCollectionWithorganizationId } from "./database.functions";
import { DATABASE_INTERFACE } from "./DATABASE_INTERFACE";
import { getBeginningOfDayFromDate, getFullDateRange } from "src/shared/functions/date-time.functions";
import { MongoDbService } from "src/integrations/Mongo-Db/services/mongo-db/mongo-db.service";
import { generateRandomString } from "victor-dev-toolbox";

/**
 * The `DatabaseService` class is a NestJS service that provides a set of methods for interacting with a database. It implements the `DATABASE_INTERFACE` interface and uses the `RtdbService` (for firebase, mongo Db coming soon) to perform the actual database operations.
 *
 * The service provides methods for:
 * - Checking if a document exists in the database based on a set of fields
 * - Getting all items from a collection
 * - Getting an item by its ID
 * - Getting items by a single field value
 * - Getting items by multiple field values
 * - Creating a new item
 * - Updating an existing item
 * - Deleting an item
 * - Deleting an entire collection
 *
 * The service also provides a private `collectionWithorganizationId` method that modifies the collection name to include the organization ID, which is a common requirement for multi-tenant applications.
 */
@Injectable()
@Global()
export class DatabaseService implements DATABASE_INTERFACE {
    constructor(
        // You can replace this with your own database service implementation
        // private DBservice: RtdbService,
        private DBservice: MongoDbService,
    ) {

    }

    async checkIfExists(data: checkIfExistsInterface): Promise<boolean> {
        const { organizationId, fields, collection } = data;
        if (!collection) throw new BadRequestException('Collection is required');

        const items = await this.getAllItems({ collection, organizationId });
        const result = await this.findByField({ fields, items });

        return result;
    }

    private async findByField(payload: { fields: FieldValueInterface[], items: any[] }): Promise<boolean> {
        const { fields, items } = payload;

        for (const f of fields) {
            const { field, value } = f;
            if (items.some(i => i[field] === value)) {
                return Promise.resolve(true);
            }
        }

        return Promise.resolve(false);
    }


    async getAllItems(payload: GetAllItemsInterface): Promise<any[]> {
        const { collection, organizationId, query } = payload;

        if (!collection) throw new BadRequestException('Collection is required');

        return this.DBservice.getAllItems({ collection, organizationId, query });
    }

    async getItem(payload: GetByIdInterface): Promise<any> {
        const { id, organizationId, collection } = payload;
        if (!collection) throw new BadRequestException('Collection is required');

        payload.collection;
        return this.DBservice.getItem(payload);
    }


    async getItemsByField(
        payload: {
            organizationId: string,
            field: string,
            value: any,
            collection: DatabaseCollectionEnums,
        }
    ): Promise<any[]> {
        const { organizationId, field, value, collection } = payload;
        if (!collection) throw new BadRequestException('Collection is required');

        payload.collection;
        return this.DBservice.getItemsByField(payload)
    }


    async getByMultipleFields(request: MultipleFieldRequestInterface): Promise<any[]> {
        return this.DBservice.getByMultipleFields(request);
    }

    async getItemsByDateRange(payload: { organizationId: string, collection: DatabaseCollectionEnums; startDate: string | Date; stopDate: string | Date; fieldToCheck?: string; }): Promise<any[]> {
        const items = await this.DBservice.getItemsByDateRange(payload);
        return items;
    }


    async createItem(
        payload: {
            id: string,
            itemDto: any,
            collection: DatabaseCollectionEnums,
            organizationId: string,
            prefix?: string,
        }
    ): Promise<any> {
        const { id, itemDto, collection, organizationId, prefix } = payload;
        const itemId = id || generateUniqueId();
        if (id) {
            itemDto.id = itemId;
        }
        if (!collection) throw new BadRequestException('Collection is required');
        const serialNumber = await this.getNextSerialNumber(organizationId, collection);
        const now = new Date().toISOString();
        // itemDto._id = id;
        const day = new Date(itemDto.day || getBeginningOfDayFromDate(now)).toISOString();
        itemDto.day = day;
        // itemDto.created_at = itemDto.created_at || now;
        itemDto.createdAt = itemDto.createdAt || now;
        itemDto.createdBy = itemDto.createdBy || 'SYSTEM';
        itemDto.deleted = false;
        payload.itemDto = itemDto;
        itemDto.serialNumber = serialNumber;

        // const find = await this.DBservice.getItem({ id, collection, organizationId });
        // if (find) {
        //     throw new BadRequestException('Item already exists');
        //     return false;
        // }

        return this.DBservice.createItem(payload);
    }


    async updateItem(
        payload: {
            id: string,
            itemDto: any,
            collection: DatabaseCollectionEnums,
            organizationId: string,
        }
    ): Promise<any> {
        const { id, itemDto, collection, organizationId } = payload;
        if (!collection) throw new BadRequestException('Collection is required');

        itemDto.id = id;
        itemDto.updatedAt = itemDto.updatedAt || new Date().toISOString();
        payload.itemDto = itemDto;
        return this.DBservice.updateItem(payload);
    }


    async deleteItem(
        payload: {
            id: string,
            collection: DatabaseCollectionEnums,
            organizationId: string,
        }
    ): Promise<any> {
        const { id, collection, organizationId } = payload;
        if (!collection) throw new BadRequestException('Collection is required');

        return this.DBservice.deleteItem(payload);
    }

    async deleteCollection(payload: QueryCollectionInterface) {
        const { collection, organizationId } = payload;
        if (!collection) throw new BadRequestException('Collection is required');

        return this.DBservice.deleteCollection(payload);
    }

    // TODO:: Update entire collection with new data
    // async updateEntireCollection(data: UpdateDBInterface) {
    //     const { collection, organizationId, payload } = data;
    //     const items = await this.getAllItems({ collection, organizationId });

    // }

    // private async updateSingleItem(item: any, payload: any) {
    //     const { id, itemDto, collection, organizationId } = payload;

    // }


    // private collectionWithorganizationId(collection: DatabaseCollectionEnums, organizationId: string,) {
    //     // cons = getCollectionWithorganizationId(collection, organizationId) as DatabaseCollectionEnums;
    //     cons = collection;
    //     retur;
    // }

    private async getNextSerialNumber(organizationId: string, collection: DatabaseCollectionEnums): Promise<string> {
        const serialNumbersCollection = DatabaseCollectionEnums.SERIAL_NUMBERS;
        const serial = await this.DBservice.getItem({ id: collection, collection: serialNumbersCollection, organizationId });
        const serialNumber = serial?.number || 1;
        const nextSerial = serialNumber + 1;
        const randomPart = generateRandomString(4).toUpperCase();
        const year = new Date().getFullYear();
        const fullSerial = `SB-${serialNumber.toString().padStart(3, '0')}-${randomPart}-${year}`
        if (!serial) {
            this.DBservice.createItem({ id: collection, organizationId, itemDto: { number: nextSerial }, collection: serialNumbersCollection })
        } else {
            this.DBservice.updateItem({ id: collection, organizationId, itemDto: { number: nextSerial }, collection: serialNumbersCollection });
        }
        return fullSerial;

    }

    // private getSerialNumber(length?: number) {
    //     const len = length || 4;
    //     const profanity = 
    // }




}
