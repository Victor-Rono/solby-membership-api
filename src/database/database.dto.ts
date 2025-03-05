/* eslint-disable prettier/prettier */
import { RecordInterface } from 'src/shared/interfaces/record.interface';
import { DBStatusTypes } from './database.interface';
export class DatabaseDTO implements RecordInterface {
    id: string;
    createdBy: string;
    createdAt?: string;
    created_at?: string;
    imageURLs?: string[];
    documentURLs?: string[];
    authorizedUsers?: string[];
    description?: string;
    uniqueId?: string;
    deleted?: boolean;
    deletedBy?: string;
    updatedBy?: string;
    updatedAt?: string;
    status?: DBStatusTypes;
    outOfStock?: boolean;
    serialNumber?: string;
    remarks?: string;

}