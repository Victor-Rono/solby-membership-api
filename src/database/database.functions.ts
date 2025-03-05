/* eslint-disable prettier/prettier */
import { FieldValueInterface, generateUniqueId as uniqueId } from 'victor-dev-toolbox';

import { DatabaseCollectionEnums, DBRequestInterface, ParsedCollectionInterface } from "src/database/database.interface";
generateUniqueId
// let counter = 0;
// let lastTimestamp = 0;

/**
 * Generates a unique ID string composed of a timestamp, counter, and random string.
 *
 * The ID is generated using the current timestamp, a counter that increments if multiple IDs are
 * generated in the same millisecond, and a random string. This ensures a very high likelihood of
 * uniqueness while still being short and url-safe.
 *
 * The timestamp is converted to a base36 string to shorten it. The counter is also base36 and
 * zero-padded. The random part is 4 characters for more randomness. These are joined with hyphens.
 *
 * Useful for generating unique but deterministic IDs for database documents or other entities.
 */
export function generateUniqueId(): string {
    // const now = Date.now();

    // if (now !== lastTimestamp) {
    //     counter = 0;
    //     lastTimestamp = now;
    // } else {
    //     counter++;
    // }
    // const timestampPart = now.toString(36); // Convert timestamp to base36 string
    // const counterPart = counter.toString(36).padStart(2, '0'); // Convert counter to base36 and pad with zeros
    // const randomPart = generateRandomString(4); // Longer random part (4 characters)

    // const id = `${timestampPart}-${counterPart}-${randomPart}`;
    const id = uniqueId();
    return id;
}

/**
 * Generates a random string of the specified length.
 *
 * The string is composed of alphanumeric characters (A-Z, a-z, 0-9).
 *
 * @param length - The length of the random string to generate.
 * @returns A random string of the specified length.
 */
function generateRandomString(length: number): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return randomString;
}

/**
 * Generates a collection path string that includes the organization ID if provided and the collection type.
 *
 * If an organization ID is provided and the collection type is not in the list of collections to avoid,
 * the function will return the collection path as `{organizationId}/{collection}`. Otherwise, it will
 * simply return the collection type.
 *
 * @param collection - The type of Firebase collection.
 * @param organizationId - The ID of the organization, if applicable.
 * @returns The collection path string.
 */
export function getCollectionWithorganizationId(
    collection: DatabaseCollectionEnums,
    organizationId?: string | null,
): string {
    const collectionsToAvoid: DatabaseCollectionEnums[] = [
        DatabaseCollectionEnums.USERS,
        DatabaseCollectionEnums.USERS_BACKUP,
        DatabaseCollectionEnums.ORGANIZATIONS,
        DatabaseCollectionEnums.DELETED_ORGANIZATIONS,
        DatabaseCollectionEnums.DELETED_USERS,
        DatabaseCollectionEnums.CREDENTIALS,
        DatabaseCollectionEnums.PASSWORD_RESETS
    ];
    if (organizationId && !collectionsToAvoid.includes(collection)) {
        return `${organizationId}/${collection}`;
    } else {
        return collection;
    }
}





export function parseCollectionPath(path: string): ParsedCollectionInterface {
    const parts = path.split('/');
    if (parts.length === 2) {
        return {
            organizationId: parts[0],
            collection: (parts[1] as DatabaseCollectionEnums),
        };
    } else {
        return {
            organizationId: null,
            collection: (parts[1] as DatabaseCollectionEnums),
        };
    }
}


export function generateCollectionProvider(collection: DatabaseCollectionEnums): { provide: 'COLLECTION', useValue: DatabaseCollectionEnums } {
    return {
        provide: 'COLLECTION',
        useValue: collection,
    };
}



export function createPayload(data: { id?: string, organizationId: string, payload?: any }) {
    const { payload, organizationId, id } = data;
    const request: DBRequestInterface = {
        id,
        payload,
        organizationId,
    }


    return request;
}

export function filterItemsByFieldValues(
    payload: { items: any[], fields: FieldValueInterface[], queryType: 'matchAll' | 'matchOne' }
) {
    const { items, fields, queryType } = payload;

    const filteredItems: any[] = [];

    items.forEach(item => {
        const matches = checkItemAgainstFields({ item, fields, queryType });
        if (matches) {
            filteredItems.push(item);
        };
    });
    return filteredItems;
}

function checkItemAgainstFields(payload: { item: any, fields: FieldValueInterface[], queryType: 'matchAll' | 'matchOne' }) {
    const { item, fields, queryType } = payload;
    let result = false;

    if (queryType === 'matchAll') {
        result = true;
        fields.forEach((f) => {
            const { field, value } = f;
            const itemValue = item[field];
            if (itemValue !== value) {
                result = false;
            }

        });

    } else {
        fields.forEach((f) => {
            const { field, value } = f;
            const itemValue = item[field];

            if (itemValue === value) {
                result = true;
            }
        });

    }


    return result;

}