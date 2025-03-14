/* eslint-disable prettier/prettier */
import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { generateUniqueId } from "src/database/database.functions";
import { CreateItemInterface, CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface, FieldValueRequestInterface, GetAllItemsInterface, GetByFieldInterface, GetByMultipleFieldsInterface, MultipleFieldRequestInterface, updateItemInterface, } from "src/database/database.interface";
import { DatabaseService } from "src/database/database.service";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";




/**
 * The `BaseService` class provides a set of common CRUD operations for interacting with a database collection.
 * It is designed to be extended by other service classes that need to perform database operations.
 *
 * The class is parameterized with four type parameters:
 * - `CreateDto`: the data transfer object (DTO) used for creating new items
 * - `ReadDto`: the DTO used for reading items
 * - `UpdateDto`: the DTO used for updating items
 * - `DeleteDto`: the DTO used for deleting items
 *
 * The class has the following methods:
 * - `getById(request: DBRequestInterface): Promise<ReadDto>`: Retrieves a single item by its ID and organization ID.
 * - `getAll(organizationId: string): Promise<ReadDto[]>`: Retrieves all items for the specified organization ID.
 * - `getByField(request: FieldValueRequestInterface): Promise<ReadDto[]>`: Retrieves items by a single field and value.
 * - `getByMultipleFields(request: MultipleFieldRequestInterface): Promise<ReadDto[]>`: Retrieves items by multiple fields.
 * - `create(createDTO: CreateRequestInterface): Promise<CreateDto>`: Creates a new item.
 * - `update(request: CreateRequestInterface): Promise<UpdateDto>`: Updates an existing item.
 * - `deleteRecord(payload: DBRequestInterface): Promise<DeleteDto>`: Deletes a single item by its ID and organization ID.
 * - `deleteCollection(organizationId: string)`: Deletes the entire collection for the specified organization ID.
 *
 * The class uses the `DatabaseService` to perform the actual database operations.
 */
@Injectable()
export class BaseService<CreateDto, ReadDto, UpdateDto, DeleteDto> {

    @Inject(DatabaseService)
    public readonly databaseService: DatabaseService;

    @Inject(EventEmitter2)
    public readonly eventEmitter: EventEmitter2;

    /*
        Define the Firebase Collection to be used in your module as shown below:
            {
                provide: 'COLLECTION',
                useValue: 'your-collection',
            },
    
            */
    @Inject('COLLECTION') protected collection: DatabaseCollectionEnums;

    constructor(
        // @Inject('COLLECTION') collection: DatabaseCollectionEnums
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ) { }

    async getById(request: DBRequestInterface): Promise<ReadDto> {
        const { id, organizationId } = request;
        const response = await this.databaseService.getItem({ id, organizationId, collection: this.collection });

        return response;
    }

    async getAll(organizationId: string, query?: any): Promise<ReadDto[]> {

        const itemDTO: GetAllItemsInterface = {
            organizationId,
            collection: this.collection,
        }

        const response = await this.databaseService.getAllItems(itemDTO);
        return response.filter(response => response.id);
    }


    async getByField(request: FieldValueRequestInterface): Promise<ReadDto[]> {
        // const { field, value } = payload;
        const { organizationId, payload, id } = request;
        const { field, value } = payload;
        const itemDTO: GetByFieldInterface = {
            organizationId,
            collection: this.collection,
            field,
            value
        }
        const response = await this.databaseService.getItemsByField(itemDTO);
        return response;
    }

    async getByMultipleFields(request: MultipleFieldRequestInterface): Promise<ReadDto[]> {
        const { organizationId, payload, id } = request;


        const itemDTO: MultipleFieldRequestInterface = {
            organizationId,
            payload,
            id,
            collection: this.collection,
        }

        const response = await this.databaseService.getByMultipleFields(itemDTO);
        return response;
    }

    async create(createDTO: CreateRequestInterface): Promise<CreateDto> {

        const { organizationId, payload } = createDTO;
        const modifiedPayload = payload as any;
        const id = modifiedPayload.id || generateUniqueId();
        if (!modifiedPayload.createdAt) {
            modifiedPayload.createdAt = new Date().toISOString();
        }
        const itemDTO: CreateItemInterface = {
            id,
            organizationId,
            collection: this.collection,
            itemDto: payload,

        }
        const response = await this.databaseService.createItem(itemDTO);
        return response;
    }

    async update(request: CreateRequestInterface): Promise<UpdateDto> {
        const { id, payload, organizationId } = request;

        const itemDTO: updateItemInterface = {
            id,
            organizationId,
            collection: this.collection,
            itemDto: payload,

        }

        const response = await this.databaseService.updateItem(itemDTO);
        return response;
    }

    async getByDateRange(request: DBRequestInterface): Promise<ReadDto[]> {
        const { id, payload, organizationId } = request;
        const { startDate, stopDate, fieldToCheck } = payload;
        const records = await this.databaseService.getItemsByDateRange({ organizationId, collection: this.collection, startDate, stopDate, fieldToCheck: fieldToCheck || 'createdAt' });
        return records;

    }



    async deleteRecord(payload: DBRequestInterface): Promise<DeleteDto> {
        const { id, organizationId } = payload;
        const response = await this.databaseService.deleteItem({ id, organizationId, collection: this.collection });
        return response;
    }

    async deleteCollection(organizationId: string) {
        const items: any[] = await this.getAll(organizationId);
        const promises = items.map((item) => this.deleteRecord({ id: item.id, organizationId }));
        // return await this.databaseService.deleteCollection({ organizationId, collection: this.collection })
    }

    async getAllFromCollection(payload: { organizationId: string, collection: DatabaseCollectionEnums }) {
        return this.databaseService.getAllItems(payload);
    }

    async getOrganization(organizationId: string): Promise<OrganizationInterface> {
        const organization = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }

}
