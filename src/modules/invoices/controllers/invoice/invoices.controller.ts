/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { BaseController, prepareRequest } from '../../../base/base.controller';
import { ProcessInvoiceInterface } from '../../invoices.interface';
import { InvoiceManagerService } from '../../services/invoice-manager/invoice-manager.service';
import { InvoicesService } from '../../services/invoice/invoices.service';

@Controller('invoices')
export class InvoicesController extends BaseController<any, any, any, any> {
    constructor(
        private readonly service: InvoicesService,
    ) {
        super(service);
    }

    @Post('process-invoice')
    processInvoice(@Headers() headers: any, @Body() body: any) {

        const payload = prepareRequest({ headers, payload: body });
        return this.service.processInvoice(payload);
    }

    @Post('process-multiple-invoicces')
    processMultipleInvoices(@Headers() headers: any, @Body() body: ProcessInvoiceInterface) {
        const payload = prepareRequest({ headers, payload: body });
        return this.service.processMultipleInvoices(payload);
    }


    @Post('sales-dashboard')
    getSalesDashboard(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body });
        return this.service.getSalesDashboardContent(payload);
    }

    // @Get('sales-dashboard/:userId')
    // getUserSalesDashboard(@Headers() headers: any, @Param('userId') userId: string, params: any) {
    //     const data = prepareRequest({ headers, });
    //     const payload = { userId };
    //     data.payload = payload;

    //     return this.service.getSalesDashboardContent(data);
    // }

    @Post('all')
    getAllInvoices(@Headers() headers: any, @Body() body: ProcessInvoiceInterface) {
        const payload = prepareRequest({ headers, payload: body });
        return this.service.getInvoicesForEachUser(payload);
    }

    @Post('process-sale')
    getInvoicesForEachUser(@Headers() headers: any, @Body() body: any) {

        const payload = prepareRequest({ headers, payload: body });
        return this.service.getInvoicesForEachUser(payload);
    }

    @Post('process-all')
    processAll(@Headers() headers: any, @Body() body: any) {

        const payload = prepareRequest({ headers, payload: body });
        return this.service.processAllInvoices(payload);
    }
}


