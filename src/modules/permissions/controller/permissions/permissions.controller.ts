/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Headers } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Controller('permissions')
export class PermissionsController extends BaseController<any, any, any, any> {
    constructor(private permissionsService: PermissionsService) {
        super(permissionsService);
    }

    @Post('transfer')
    transferPermissions(@Headers() headers: any, @Body() body: any) {
        const request = prepareRequest({ payload: body, headers });
        const { organizationId, payload } = request;

        return this.permissionsService.transferPermissions(({ organizationId, payload }))
    }


    // @Get('get-by-user-id/:id')
    // getByUserId(@Headers() headers: any, @Param('id') id: string) {
    //     const organizationId: string | null = headers['organizationid'] || null;
    //     return this.permissionsService.getByUserId({
    //         organizationId: organizationId,
    //         id,
    //     });
    // }

    // @Post('get-user-by-phone')
    // getByPhone(@Headers() headers: any, @Body() payload: any) {
    //     const { phone } = payload;
    //     const organizationId: string | null = headers['organizationid'] || null;
    //     return this.permissionsService.getUserByPhone({
    //         organizationId: organizationId,
    //         phone,
    //     });
    // }
}
