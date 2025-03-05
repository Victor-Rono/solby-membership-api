/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Headers } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { TenantsService } from '../../services/tenants/tenants.service';

@Controller('tenants')
export class TenantsController extends BaseController<any, any, any, any> {
    constructor(
        private service: TenantsService,
    ) {
        super(service);
    }


    @Get('restore/:id')
    async restore(@Param('id') id: string, @Headers() headers: any) {
        const request = prepareRequest({ headers, id });
        return this.service.restore(request);
    }

    @Get('deleted/all')
    getDeletedTenants(@Headers() headers: any) {
        const request = prepareRequest({ headers });
        return this.service.getAllDeletedOrganizations(request);
    }

    @Get('deleted/all/:id')
    getSingleDeletedTenant(@Param('id') id: string, @Headers() headers: any) {
        const request = prepareRequest({ headers });
        return this.service.getDeletedOrgById(request);
    }

    @Get('user/:id')
    getUserTenants(@Param('id') id: string, @Headers() headers: any) {
        const request = prepareRequest({ headers, id });
        return this.service.getUserOrgs(request);
    }

}
