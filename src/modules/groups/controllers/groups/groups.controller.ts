/* eslint-disable prettier/prettier */
import { Controller, Get, Headers, Param, Post, Body } from '@nestjs/common';
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

    @Post('admin/make')
    makeAdmin(@Headers() headers: any, @Body() body: any) {
        const request = prepareRequest({ headers, payload: body });
        return this.service.makeAdmin(request);
    }

    @Post('admin/remove')
    removeAdmin(@Headers() headers: any, @Body() body: any) {
        const request = prepareRequest({ headers, payload: body });
        return this.service.removeAdmin(request);
    }
}
