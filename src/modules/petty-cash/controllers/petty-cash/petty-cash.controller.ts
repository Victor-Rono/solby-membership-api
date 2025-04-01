/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Get } from '@nestjs/common';
import { PettyCashService } from '../../services/petty-cash/petty-cash.service';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';

@Controller('petty-cash')
export class PettyCashController extends BaseController<any, any, any, any> {
    constructor(private readonly service: PettyCashService) {
        super(service)
    }

    @Post('date-range')
    async getPettyCashByDateRange(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        return this.service.getPettyCashByDateRange(payload);
    }

    @Get('account/get')
    async getPettyCashAccount(@Headers() headers: any) {
        const payload = prepareRequest({ headers });
        return this.service.getPettyCashAccount(payload);
    }
}
