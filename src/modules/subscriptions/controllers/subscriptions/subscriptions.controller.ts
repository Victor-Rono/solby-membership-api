/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController extends BaseController<any, any, any, any> {
    constructor(
        private service: SubscriptionsService,
    ) {
        super(service);
    }

    @Post('config/save')
    async configure(@Body() body: any, @Headers() headers: any) {
        const request = prepareRequest({ headers, payload: body });
        // return this.service.configure();
        return this.service.saveSubscriptionConfig(request);
    }

    @Get('config/all')
    async getAllConfig(@Headers() headers: any) {
        const request = prepareRequest({ headers });
        return this.service.getSubscriptionConfig(request);
    }
}
