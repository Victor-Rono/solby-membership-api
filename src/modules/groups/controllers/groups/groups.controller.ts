/* eslint-disable prettier/prettier */
import { Controller, Get, Headers, Param } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { GroupsService } from '../../services/groups/groups.service';

@Controller('groups')
export class GroupsController extends BaseController<any, any, any, any> {
    constructor(private readonly service: GroupsService) {
        super(service);
    }

    @Get('stats/:id')
    getStats(@Headers() headers: any, @Param('id') id: string) {
        const request = prepareRequest({ headers, id });
        return this.service.getGroupStats(request);
    }
}
