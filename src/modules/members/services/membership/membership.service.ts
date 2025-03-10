/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/modules/base/base.service';

@Injectable()
export class MembershipService extends BaseService<any, any, any, any> {
    constructor() {
        super();
    }

    // Create Subscriptions


} 
