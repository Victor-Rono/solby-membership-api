/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { generateFields, generateSearchFields, searchObjectsByFields, sortArrayByKey } from 'victor-dev-toolbox';
import { SearchFieldsInterface } from 'src/shared/interfaces/search.interface';

@Injectable()
export class ArrayService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    /**
     * Sorts an array in descending order
     *
     * @param {string} key
     * @param {('ASC' | 'DESC')} order
     * @param {any[]} array
     * @return {*}
     * @memberof ArrayService
     */
    sort(key: string, order: 'ASC' | 'DESC', array: any[]) {
        return sortArrayByKey(key, order, array);
    }

    /**
     * Search and filter items where any of the specified search fielsa matches a search term
     *
     * @param {any[]} objectsArray
     * @param {string[]} searchFields
     * @param {string} [searchTerm]
     * @return {*}  {any[]}
     * @memberof ArrayService
     */
    searchObjectsByFields(
        objectsArray: any[],
        searchFields: string[],
        searchTerm?: string,
    ): any[] {
        return searchObjectsByFields(objectsArray, searchFields, searchTerm);
    }

    /**
     * Returns an array of type SearchFieldsInterface to be used for search and filter
     *
     * @param {string[]} fields
     * @return {*}  {Array<SearchFieldsInterface>}
     * @memberof ArrayService
     */
    generateSearchFields(fields: any[]): SearchFieldsInterface[] {
        return generateSearchFields(fields);
    }

    generateFields(searchFields: SearchFieldsInterface[]): string[] {
        return generateFields(searchFields);
    }
}
