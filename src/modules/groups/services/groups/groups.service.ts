/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';

@Injectable()
export class GroupsService extends BaseService<any, any, any, any> {
    constructor() {
        super();
    }
}
