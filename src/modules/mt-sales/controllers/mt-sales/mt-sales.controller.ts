/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Get } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { MtSalesService } from '../../services/mt-sales/mt-sales.service';
import { DatabaseCollectionEnums } from 'src/database/database.interface';

@Controller('mt-sales')
export class MtSalesController extends BaseController<any, any, any, any> {
    constructor(
        private salesService: MtSalesService,
    ) {
        super(salesService)
    }

    @Post('cash-sale')
    makeSale(@Body() payload: any, @Headers() headers: any) {
        const data = prepareRequest({ payload, headers });
        return this.salesService.cashSale(data)
    }

    @Post('credit-sale')
    makeCreditSale(@Body() payload: any, @Headers() headers: any) {

        const data = prepareRequest({ payload, headers });
        return this.salesService.creditSale(data)
    }

    // @Get('clear/allss')
    // clearAll(@Headers() headers: any) {
    //     const payload = prepareRequest({ headers });
    //     payload.collection = DatabaseCollectionEnums.INVOICES;
    //     this.salesService.clean(payload);

    // }
    @Get('dashboard/summary')
    async dashboard(@Headers() headers: any) {
        const payload = prepareRequest({ headers });
        return this.salesService.dashboard(payload);
    }
}
