/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Res, Headers } from '@nestjs/common';
import { FarmersService } from '../../services/farmers/farmers.service';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';

@Controller('farmers')
export class FarmersController extends BaseController<any, any, any, any> {
    constructor(private readonly service: FarmersService) {
        super(service);
    }
    @Post('add-creditor')
    async addCreditor(@Body() payload: any, @Headers() headers: any,) {
        const request = prepareRequest({ headers, payload });
        const add = await this.service.addCreditor(request);
        return add;
    }


    @Get('invoices/pending/:id')
    async pendingInvoices(@Param('id') id, @Headers() headers: any,) {
        const payload = prepareRequest({ id, headers });
        return this.service.getAllPendingInvoices(payload);
    }
    @Post('report/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.service.downloadAsPDF(payload);
        const { fileName, pdfBuffer } = ledger;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
        // return ledger;
    }

    @Post('report/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.service.sendToEmail(payload);
        return true;
        // return ledger;
    }

    @Post('report/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.service.print(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }

    @Get('dashboard/today')
    async dashboard(@Headers() headers: any,) {
        const payload = prepareRequest({ headers });
        const dashboard = await this.service.dashboard(payload);
        return dashboard;
    }

    @Post('date-range/:id')
    getSingleFarmerInvoicesByDateRange(@Body() body: any, @Headers() headers, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ headers, payload: body, id });

        return this.service.getSingleFarmerInvoicesByDateRange(payload);
    }

    @Post('dateRange/:id/download')
    async downloadinvoiceAsPDF(@Body() body: any, @Headers() headers: any, @Param('id') id: string, @Param('field') field: string, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers, id });

        const document = await this.service.downloadSingleFarmerInvoice(payload);
        const { fileName, pdfBuffer } = document;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
    }

    @Post('dateRange/:id/email')
    async sendFarmerEmail(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ payload: body, headers, id });

        const send = this.service.sendSingleFarmerInvoiceToEmail(payload);
        return true;
        // return invoice;
    }
    @Post('dateRange/:id/print')
    async printFarmerEmail(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ payload: body, headers, id });
        const invoice = await this.service.printSingleFarmerInvoice(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(invoice); // Send the HTML content
    }

    @Post('purchase')
    makeSale(@Body() payload: any, @Headers() headers: any) {
        const data = prepareRequest({ payload, headers });

        return this.service.purchase(data)
    }

    @Post('pending-invoices')
    async pendingFarmerInvoices(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const invoice = await this.service.getFarmerPendingInvoices(payload);
        return invoice;
    }
}
