/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { BaseController, prepareRequest } from '../base/controllers/base/base.controller';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController extends BaseController<any, any, any, any> {
    constructor(
        private service: ProductsService,
    ) {
        super(service);
    }


    @Post('stock-removal')
    stockRemoval(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body });
        return this.service.stockRemoval(payload);
    }

}
