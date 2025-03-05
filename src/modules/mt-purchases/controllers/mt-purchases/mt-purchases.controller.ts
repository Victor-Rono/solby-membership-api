/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { MtPurchasesService } from '../../services/mt-purchases/mt-purchases.service';

@Controller('mt-purchases')
export class MtPurchasesController extends BaseController<any, any, any, any> {
    constructor(
        private purchasesService: MtPurchasesService,
    ) {
        super(purchasesService)
    }

    @Post('purchase')
    makeSale(@Body() payload: any, @Headers() headers: any) {
        const data = prepareRequest({ payload, headers });

        return this.purchasesService.purchase(data)
    }

}
