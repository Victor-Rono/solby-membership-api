/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';

@Injectable()
export class ExpensesService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.EXPENSES;
    constructor() {
        super();
    }
}
