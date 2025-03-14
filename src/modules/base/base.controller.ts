/* eslint-disable prettier/prettier */
import { Get, UsePipes, ValidationPipe, Param, Post, Body, Put, Delete, Headers } from "@nestjs/common";
import { BaseService } from "./base.service";
import { CreateRequestInterface, DBRequestInterface, FieldValueInterface, FieldValueRequestInterface, MultipleFieldRequestInterface, MultipleFieldValueInterface } from "src/database/database.interface";

/**
 * The `BaseController` class is a generic controller that provides basic CRUD operations for a database entity.
 * It uses the `BaseService` to perform the actual database operations.
 *
 * The controller supports the following operations:
 * - `getById`: Retrieves a single entity by its ID.
 * - `getAll`: Retrieves all entities for the current organization.
 * - `getByField`: Retrieves entities by a single field value.
 * - `getByMultipleFields`: Retrieves entities by multiple field values.
 * - `create`: Creates a new entity.
 * - `update`: Updates an existing entity.
 * - `delete`: Deletes an existing entity.
 *
 * The controller uses the `preparePayload` function to create the necessary request object for the `BaseService` methods.
 */
export class BaseController<CreateDto, ReadDto, UpdateDto, DeleteDto> {
    constructor(private readonly baseService: BaseService<CreateDto, ReadDto, UpdateDto, DeleteDto>) { }

    @Get(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getById(@Param('id') id: string, @Headers() headers: any): Promise<ReadDto> {
        const request = prepareRequest({ headers, id });
        return this.baseService.getById(request);
    }

    @Get()
    // @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(@Headers() headers: any): Promise<ReadDto[]> {

        const organizationId = getOrganizationIdFromHeaders(headers);

        return this.baseService.getAll(organizationId);
    }

    @Post('get-by-field')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getByField(@Body() getByFieldDto: FieldValueInterface, @Headers() headers: any) {
        const request: FieldValueRequestInterface = prepareRequest({ headers, payload: getByFieldDto }) as FieldValueRequestInterface;
        return this.baseService.getByField(request);
    }

    @Post('get-by-multiple-fields')
    async getByMultipleFields(@Body() getByMultipleFieldsDto: MultipleFieldValueInterface, @Headers() headers: any) {
        const request: MultipleFieldRequestInterface = prepareRequest({ headers, payload: getByMultipleFieldsDto }) as MultipleFieldRequestInterface;

        return this.baseService.getByMultipleFields(request);
    }

    @Post('date-range')
    async getByDateRange(@Body() getByDateRangeDto: DBRequestInterface, @Headers() headers: any) {
        const request = prepareRequest({ headers, payload: getByDateRangeDto });
        return this.baseService.getByDateRange(request);
    }

    @Post()
    async create(@Body() createDto: CreateDto, @Headers() headers: any): Promise<CreateDto> {
        const payload: CreateRequestInterface = prepareRequest({ headers, payload: createDto }) as CreateRequestInterface;

        return this.baseService.create(payload);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDto: UpdateDto, @Headers() headers: any): Promise<UpdateDto> {
        const payload: CreateRequestInterface = prepareRequest({ id, headers, payload: updateDto }) as CreateRequestInterface;

        return this.baseService.update(payload);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Headers() headers: any): Promise<DeleteDto> {
        const request = prepareRequest({ headers, id });
        return this.baseService.deleteRecord(request);
    }

    @Delete('collection/all')
    async deleteCollection(@Headers() headers: any): Promise<any> {
        const request = prepareRequest({ headers });


        return this.baseService.deleteCollection(request.organizationId);
    }


}

function getOrganizationIdFromHeaders(headers: any) {
    const organizationId: string | null = headers['organizationid'] || null;
    return organizationId;
}

export function prepareRequest(data: { id?: string, headers: any, payload?: any }) {
    const { payload, headers, id } = data;
    const organizationId = getOrganizationIdFromHeaders(headers)
    const request: DBRequestInterface = {
        id,
        payload,
        organizationId,
    }

    return request;
}


