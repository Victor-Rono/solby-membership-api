/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { filterItemsByFieldValues, parseCollectionPath } from 'src/database/database.functions';
import { DatabaseCollectionEnums, MultipleFieldQueryInterface, MultipleFieldRequestInterface } from 'src/database/database.interface';
import { getFullDateRange } from 'src/shared/functions/date-time.functions';
import { generateRandomString, getFieldValuesFromArray } from 'victor-dev-toolbox';
@Injectable()
export class RtdbService {
    private readonly firebaseApp: admin.app.App;
    private rtdb = this.getDatabase();
    // constructor() {

    // }

    private getAuth() {
        return this.firebaseApp.auth();
    }

    private getDatabase() {
        return admin.database();
    }

    async checkIfExists(id: string, collection: DatabaseCollectionEnums) {
        const snapshot = await this.rtdb.ref(`${collection}/${id}`).once('value');
        const item = snapshot.val();
        return item;
    }

    /**
   * Gets all items from the provided Firebase collection.
   * @param collection Name of the Firebase collection to get items from.
   * @returns Promise resolving to an array of all items in the collection.
   */
    async getAllItems(collection: DatabaseCollectionEnums, option?: { includeDeleted?: 'includeDeleted' }): Promise<any[]> {
        // const modifiedCollection = this.collectionWithorganizationId(collection);
        const snapshot = await this.rtdb.ref(collection).orderByChild('id').once('value');
        const items = snapshot.val();

        return items ? Object.values(items) : [];
    }

    /**
* Gets a single item from the provided Firebase collection by its ID.
*
* @param id - The ID of the item to get.
* @param collection - The name of the Firebase collection to get the item from.
* @returns A promise resolving to the item data if found, or rejecting with NotFoundException if not found.
*/
    async getItem(id: string, collection: DatabaseCollectionEnums): Promise<any> {
        // const modifiedCollection = this.collectionWithorganizationId(collection);
        const snapshot = await this.rtdb.ref(`${collection}/${id}`).once('value');
        const item = snapshot.val() || null;

        if (!item) {
            // throw new NotFoundException('Item not found');

        }

        return item;
    }


    /**
* Gets items from the provided Firebase collection filtered by the given field and value.
*
* @param field - The field to filter by.
* @param value - The value to match for the filter.
* @param collection - The name of the Firebase collection to get items from.
* @returns A promise resolving to an array of items matching the filter.
*/
    async getItemsByField(
        field: string,
        value: any,
        collection: DatabaseCollectionEnums,
    ): Promise<any[]> {
        const snapshot = await this.rtdb
            .ref(collection)
            .orderByChild(field)
            .equalTo(value)
            .once('value');
        const items = snapshot.val();
        return items ? Object.values(items) : [];
    }

    /**
 * Gets items from the provided Firebase collection filtered by multiple fields.
 *
 * @param payload - An object containing the fields to filter by, the collection to get the items from, and an optional query type.
 * @param payload.fields - An array of objects containing the field and value to filter by.
 * @param payload.collection - The name of the Firebase collection to get the items from.
 * @param payload.queryType - The type of query to perform, either 'matchAll' to match all fields or 'matchOne' to match any one field.
 * @returns A promise resolving to an array of items matching the filter.
 */
    async getByMultipleFields(request: MultipleFieldRequestInterface): Promise<any[]> {
        const {
            organizationId,
            payload,
            id,
            collection,
        } = request;
        const { fields, queryType } = payload;
        const modifiedCollection = collection as DatabaseCollectionEnums;
        const allRecords = await this.getAllItems(modifiedCollection);

        const filtered = filterItemsByFieldValues({ items: allRecords, fields: fields, queryType });



        if (queryType === 'matchAll') {
            const records = allRecords.filter((record) => {
                const match = fields.every((field) => {
                    return record[field.field] === field.value;
                });
                return match;
            });
            return records;
        } else {
            const records = allRecords.filter((record) => {
                const match = fields.some((field) => {
                    return record[field.field] === field.value;
                });
                return match;
            });
            return records;
        }
    }

    /**
* Creates a new item in the provided Firebase collection.
* @param id - The ID of the item to create.
* @param itemDto - The data for the new item to create.
* @param collection - The name of the Firebase collection to create the item in.
* @returns A promise resolving to the created item data, including the generated ID.
*/
    async createItem(
        id: string,
        itemDto: any,
        collection: DatabaseCollectionEnums,
        prefix?: string
    ): Promise<any> {
        itemDto.id = id;
        const serialNumber = await this.getNextSerialNumber(collection, prefix);
        itemDto.serialNumber = serialNumber;

        const newItemRef = this.rtdb.ref(collection).child(id);
        await newItemRef.set(itemDto);
        return { id: id, ...itemDto };
    }

    /**
* Updates an existing item in the provided Firebase collection.
*
* @param id - The ID of the item to update.
* @param itemDto - The data to update the item with.
* @param collection - The name of the Firebase collection containing the item.
* @returns A promise resolving to the updated item data.
*/
    async updateItem(
        id: string,
        itemDto: any,
        collection: DatabaseCollectionEnums,
    ): Promise<any> {
        const itemRef = this.rtdb.ref(`${collection}/${id}`);

        const snapshot = await itemRef.once('value');
        const existingItem = snapshot.val();

        if (!existingItem) {
            console.warn({ collection, id, itemDto });
            // throw new NotFoundException('Item not found');
        }

        await itemRef.set({ ...existingItem, ...itemDto });
        return { id, ...itemDto };
    }

    /**
* Deletes an existing item from the provided Firebase collection.
*
* @param id - The ID of the item to delete.
* @param collection - The name of the Firebase collection containing the item.
* @returns A promise resolving to a message that the item was deleted.
*/
    async deleteItem(
        id: string,
        collection: DatabaseCollectionEnums,
    ): Promise<any> {
        const itemRef = this.rtdb.ref(`${collection}/${id}`);

        const snapshot = await itemRef.once('value');
        const existingItem = snapshot.val();

        if (!existingItem) {
            console.error(`Item not found. ${collection}, ${id}`);
        }

        await itemRef.remove();
        return { message: 'Item deleted successfully' };
    }


    //     /**
    //  * Adds the organization id before the collection to separate data from various organizations
    //  *
    //  * @param {DatabaseCollectionEnums} collection
    //  * @return {*}  {string}
    //  * @memberof RtdbService
    //  */
    //     collectionWithorganizationId(collection: DatabaseCollectionEnums, organizationId?: string | null): DatabaseCollectionEnums {
    //         // const organizationId = 
    //         const modifiedCollection = getCollectionWithorganizationId(collection, organizationId) as DatabaseCollectionEnums;
    //         return modifiedCollection;
    //     }

    private async getNextSerialNumber(modifiedCollection: string, prefix?: string): Promise<string> {
        const collection = parseCollectionPath(modifiedCollection).collection;

        const serialRef = this.rtdb.ref(`serialNumbers/${collection}`);
        const snapshot = await serialRef.once('value');
        let currentSerialNumber = snapshot.val();

        if (currentSerialNumber === null) {
            currentSerialNumber = 1;
        }

        const newSerialNumber = currentSerialNumber + 1;

        // Update the serial number in the database
        await serialRef.set(newSerialNumber);

        const random = generateRandomString(4).toUpperCase();

        // const letter = prefix || collection?.substring(0, 1).toUpperCase() || `MT-${random}`;
        const letter = `MT`;
        return `${letter}-${newSerialNumber.toString().padStart(3, '0')}-${random}`;
    }

    async deleteCollection(payload: { collection: DatabaseCollectionEnums }) {
        const { collection } = payload;

        // delete files
        // const deleteFiles = this.deleteCollectionFiles(collection);

        // delete collection
        const deleteCollection = await this.deleteNode(collection);
        return deleteCollection;

    }





    private async deleteCollectionFiles(collection: DatabaseCollectionEnums) {
        const allItems = await this.getAllItems(collection);
        const deleteFiles = await this.getFileUrlsAndDelete(allItems);
        return deleteFiles;
    }

    private async deleteNode(path: DatabaseCollectionEnums): Promise<void> {
        const db = this.getDatabase();
        try {
            await db.ref(path).remove();
            const deleteSerial = await this.deleteCollectionSerial(path);

        } catch (error) {
            console.error(`Failed to delete node at path "${path}":`, error);
            throw new Error(`Failed to delete node: ${error.message}`);
        }
    }


    // private async getFileURlsAndDelete(items: any[]) {
    //     // getFileUrlsAndDelete
    //     const fileFields: any[] = ['imageUrls', 'fileURLs'];
    //     let urls: string[] = [];
    //     fileFields.forEach(f => {
    //         const docURLS = getFieldValuesFromArray(f, items, { onlyTrueValues: 'onlyTrueValues' });
    //         urls = urls.concat(docURLS);
    //     });
    //     const deleteFiles = await this.storage.bucket().deleteFiles()
    // }

    // private async getFileUrlsAndDelete(items: any[]): Promise<void> {
    //     const fileFields: string[] = ['imageUrls', 'fileURLs'];
    //     let urls: string[] = [];

    //     fileFields.forEach(field => {
    //         const docUrls = getFieldValuesFromArray(field, items, { onlyTrueValues: 'onlyTrueValues' });
    //         urls = urls.concat(docUrls);
    //     });

    //     const bucket = admin.storage().bucket();

    //     // Extract file names from URLs
    //     const fileNames = urls.map(url => this.extractFileNameFromUrl(url));

    //     try {
    //         await Promise.all(fileNames.map(fileName => bucket.file(fileName).delete()));
    //     } catch (error) {
    //         console.error('Error deleting files:', error);
    //         // throw new Error('Failed to delete files');
    //     }
    // }
    private async getFileUrlsAndDelete(items: any[]): Promise<void> {
        const fileFields: string[] = ['imageUrls', 'fileURLs'];
        let urls: string[] = [];

        // Collect URLs from the specified fields
        fileFields.forEach(field => {
            const docUrls = getFieldValuesFromArray(field, items, { onlyTrueValues: 'onlyTrueValues' });
            urls = urls.concat(docUrls);
        });

        const bucket = admin.storage().bucket();

        // Extract file names from URLs
        const fileNames = urls.map(url => this.extractFileNameFromUrl(url));

        try {
            // Attempt to delete files, but catch and log any errors, especially for not found
            await Promise.all(fileNames.map(async (fileName) => {
                try {
                    await bucket.file(fileName).delete();
                } catch (error) {
                    if (error.code === 404) {
                        console.error(`File not found: ${fileName}`);
                    } else {
                        console.error(`Error deleting file (${fileName}):`, error);
                    }
                }
            }));
        } catch (error) {
            console.error('Unexpected error deleting files:', error);
        }
    }


    /**
     * Retrieves items from the specified database collection within the given date range.
     *
     * @param payload - An object containing the collection name and the start and end dates for the date range.
     * @param payload.collection - The name of the database collection to retrieve items from.
     * @param payload.startDate - The start date of the date range, in a format that can be parsed by the database.
     * @param payload.stopDate - The end date of the date range, in a format that can be parsed by the database.
     * @returns A Promise that resolves to an array of items matching the specified date range.
     */
    async getItemsByDateRange(payload: {
        collection: DatabaseCollectionEnums;
        startDate: string | Date;
        stopDate: string | Date;
        fieldToCheck?: string;
    }): Promise<any[]> {
        const { collection, startDate, stopDate, fieldToCheck } = payload;
        // Check for valid start and stop dates
        if (!startDate || !stopDate) {
            throw new Error("Both startDate and stopDate must be provided.");
        }

        // Ensure the date format is correct (ISO 8601 or your desired format)
        const start = new Date(startDate);
        const end = new Date(stopDate);


        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date format. Please provide valid date strings.");
        }

        // Convert dates to timestamps for querying
        const startTimestamp = start.toISOString();
        const endTimestamp = end.toISOString();
        const dateRange = getFullDateRange({ startDate: startTimestamp, stopDate: endTimestamp })
        // Ensure we query using a valid field
        const queryField = fieldToCheck || 'createdAt';

        try {
            const snapshot = await this.rtdb.ref(collection)
                .orderByChild(queryField)
                .startAt(dateRange.startDate)
                .endAt(dateRange.stopDate)
                .once('value');

            const result = snapshot.val();

            // Handle empty results
            if (!result) {
                return []; // Return an empty array instead of null
            }

            // Convert the result into an array if needed
            return Object.values(result);
        } catch (error) {
            console.error("Error fetching data from RTDB:", error);
            throw new Error("Failed to retrieve items. Please check the logs.");
        }
    }


    // Helper function to extract file name from URL
    private extractFileNameFromUrl(url: string): string {
        const urlParts = url.split('/');
        return decodeURIComponent(urlParts[urlParts.length - 1].split('?')[0]);
    }

    async deleteCollectionSerial(collection: DatabaseCollectionEnums) {
        const serialRef = this.rtdb.ref(`serialNumbers/${collection}`);
        const deleteD = await serialRef.remove();
        return deleteD;
    }
}
