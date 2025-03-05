/* eslint-disable prettier/prettier */

import { MongoClient, Db, Collection } from 'mongodb';
import { DatabaseCollectionEnums, checkIfExistsInterface, GetAllItemsInterface, GetByIdInterface, MultipleFieldRequestInterface, QueryCollectionInterface } from 'src/database/database.interface';
import { DATABASE_INTERFACE } from 'src/database/DATABASE_INTERFACE';
import { defaultMongoClient } from '../../functions/mongo.functions';
import { MongoConfig } from '../../config/mongo.config';
import { getCollectionWithorganizationId } from 'src/database/database.functions';

export class MongoDbService implements DATABASE_INTERFACE {
    private client: MongoClient;
    private db: Db;

    constructor() {
        this.client = new MongoClient(defaultMongoClient());
        this.db = this.client.db(MongoConfig.dbName);
    }

    private getCollection(organizationId: string, collection: DatabaseCollectionEnums): Collection {

        const collectionName = getCollectionWithorganizationId(collection, organizationId);
        return this.db.collection(collectionName);
    }

    async checkIfExists(data: checkIfExistsInterface): Promise<boolean> {
        const { organizationId, fields, collection } = data;
        const matches = await this.getByMultipleFields({
            organizationId,
            collection,
            payload: { fields, queryType: 'matchOne' },
        });
        return !!matches.length;
    }



    async getAllItems(payload: GetAllItemsInterface): Promise<any[]> {
        const collection = this.getCollection(payload.organizationId, payload.collection);
        const { query } = payload;
        const results = await collection.find(query).toArray();
        return results;
    }


    async getItem(payload: GetByIdInterface): Promise<any> {
        const collection = this.getCollection(payload.organizationId, payload.collection);

        // Add more logging

        const result = await collection.findOne({ id: payload.id });

        return result;
    }

    async getItemsByField(payload: {
        organizationId: string;
        field: string;
        value: any;
        collection: DatabaseCollectionEnums;
    }): Promise<any[]> {

        const collection = this.getCollection(payload.organizationId, payload.collection);
        const results = await collection
            .find({ [payload.field]: payload.value })
            .toArray();
        return results;
    }

    async getByMultipleFields(payload: MultipleFieldRequestInterface): Promise<any[]> {
        const collection = this.getCollection(payload.organizationId, payload.collection);
        const results = await collection.find({ ...payload.payload }).toArray();
        return results;
    }

    async createItem(payload: {
        id: string;
        itemDto: any;
        collection: DatabaseCollectionEnums;
        organizationId: string;
        prefix?: string;
    }): Promise<any> {

        const collection = this.getCollection(payload.organizationId, payload.collection);
        const item = { id: payload.id, ...payload.itemDto, };
        await collection.insertOne(item);
        return item;
    }

    async updateItem(payload: {
        id: string;
        itemDto: any;
        collection: DatabaseCollectionEnums;
        organizationId: string;
    }): Promise<any> {
        const collection = this.getCollection(payload.organizationId, payload.collection);
        delete payload.itemDto._id
        const result = await collection.findOneAndUpdate(
            { id: payload.id },
            { $set: payload.itemDto },
            { returnDocument: 'after' }
        );
        // return result.value;
        return result;
    }

    async deleteItem(payload: {
        id: string;
        collection: DatabaseCollectionEnums;
        organizationId: string;
    }): Promise<any> {
        const collection = this.getCollection(payload.organizationId, payload.collection);
        const result = await collection.deleteOne({ id: payload.id });
        return result.deletedCount;
    }

    async deleteCollection(payload: QueryCollectionInterface): Promise<void> {
        const collection = this.getCollection(payload.organizationId, payload.collection);
        await collection.drop();
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }


    async getItemsByDateRange(payload: {
        organizationId: string;
        collection: DatabaseCollectionEnums;
        startDate: string | Date;
        stopDate: string | Date;
        fieldToCheck?: string;
    }): Promise<any[]> {
        const { collection, startDate, stopDate, fieldToCheck } = payload;

        if (!startDate || !stopDate) {
            throw new Error("Both startDate and stopDate must be provided.");
        }

        let start = new Date(startDate).toISOString();
        const endDay = new Date(stopDate);
        endDay.setHours(23, 59, 59, 999)
        let end = new Date(endDay).toISOString();

        if (!start || !end) {

            throw new Error("Invalid date format. Please provide valid ISO date strings.");
        }

        if (start > end) {
            const startTime = start;
            start = end;
            end = startTime;
            // throw new Error("startDate cannot be greater than stopDate.");
        }

        const queryField = fieldToCheck || 'createdAt';

        try {
            const collectionRef = this.getCollection(payload.organizationId, payload.collection);

            // Construct the query
            const query = {
                [queryField]: {
                    $gte: start, // ISO string comparison
                    $lte: end,
                },
            };


            // Fetch results
            const results = await collectionRef.find(query).toArray();
            return results;
        } catch (error) {
            console.error("Error fetching data from MongoDB:", error);
            throw new Error("Failed to retrieve items. Please check the logs.");
        }
    }

}
