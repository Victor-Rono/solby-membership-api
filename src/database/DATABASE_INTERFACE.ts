/* eslint-disable prettier/prettier */
import { checkIfExistsInterface, DatabaseCollectionEnums, GetAllItemsInterface, GetByIdInterface, MultipleFieldRequestInterface, QueryCollectionInterface } from "./database.interface";

/**
 * Defines the interface for a database management system, providing methods to interact with the database.
 */
export interface DATABASE_INTERFACE {

    /**
     * Checks if an item exists in the database based on the provided data.
     *
     * @param data - An object containing the necessary data to check if an item exists.
     * @returns A Promise that resolves to a boolean indicating whether the item exists or not.
     */
    checkIfExists(data: checkIfExistsInterface): Promise<boolean>;


    /**
     * Retrieves all items from the database.
     *
     * @param payload - An object containing the necessary parameters to retrieve all items.
     * @returns A Promise that resolves to an array of all items in the database.
     */
    getAllItems(payload: GetAllItemsInterface): Promise<any[]>;



    /**
     * Retrieves an item from the database based on the provided ID.
     *
     * @param payload - An object containing the necessary parameters to retrieve an item by ID.
     * @returns A Promise that resolves to the retrieved item.
     */
    getItem(payload: GetByIdInterface): Promise<any>;



    /**
     * Retrieves items from the database based on the provided field and value.
     *
     * @param payload - An object containing the necessary parameters to retrieve items by field and value.
     * @param payload.organizationId - The ID of the organization to filter the items by.
     * @param payload.field - The field to filter the items by.
     * @param payload.value - The value to filter the items by.
     * @param payload.collection - The database collection to retrieve the items from.
     * @returns A Promise that resolves to an array of items matching the provided field and value.
     */
    getItemsByField(payload: {
        organizationId: string;
        field: string;
        value: any;
        collection: DatabaseCollectionEnums;
    }): Promise<any[]>;



    /**
     * Retrieves items from the database based on multiple fields and their corresponding values.
     *
     * @param payload - An object containing the necessary parameters to retrieve items by multiple fields.
     * @param payload.organizationId - The ID of the organization to filter the items by.
     * @param payload.query - An object containing the field-value pairs to filter the items by.
     * @returns A Promise that resolves to an array of items matching the provided query.
     */
    getByMultipleFields(payload: MultipleFieldRequestInterface): Promise<any[]>;



    /**
     * Creates a new item in the database.
     *
     * @param payload - An object containing the necessary parameters to create a new item.
     * @param payload.id - The unique identifier for the new item.
     * @param payload.itemDto - The data object representing the new item.
     * @param payload.collection - The database collection to create the new item in.
     * @param payload.organizationId - The ID of the organization the new item belongs to.
     * @param payload.prefix - An optional prefix to apply to the item ID.
     * @returns A Promise that resolves to the created item.
     */
    createItem(payload: {
        id: string;
        itemDto: any;
        collection: DatabaseCollectionEnums;
        organizationId: string;
        prefix?: string;
    }): Promise<any>;



    /**
     * Updates an existing item in the database.
     *
     * @param payload - An object containing the necessary parameters to update an existing item.
     * @param payload.id - The unique identifier of the item to update.
     * @param payload.itemDto - The updated data object representing the item.
     * @param payload.collection - The database collection the item belongs to.
     * @param payload.organizationId - The ID of the organization the item belongs to.
     * @returns A Promise that resolves to the updated item.
     */
    updateItem(payload: {
        id: string;
        itemDto: any;
        collection: DatabaseCollectionEnums;
        organizationId: string;
    }): Promise<any>;



    /**
     * Deletes an existing item from the database.
     *
     * @param payload.id - The unique identifier of the item to delete.
     * @param payload.collection - The database collection the item belongs to.
     * @param payload.organizationId - The ID of the organization the item belongs to.
     * @returns A Promise that resolves when the item has been deleted.
     */
    deleteItem(payload: {
        id: string;
        collection: DatabaseCollectionEnums;
        organizationId: string;
    }): Promise<any>;



    /**
     * Deletes an existing database collection.
     *
     * @param payload - An object containing the necessary parameters to delete a database collection.
     * @param payload.collection - The database collection to delete.
     * @param payload.organizationId - The ID of the organization the collection belongs to.
     * @returns A Promise that resolves when the collection has been deleted.
     */
    deleteCollection(payload: QueryCollectionInterface): Promise<void>;

    // Private methods are typically not included in interfaces
}
