/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Param, Res } from '@nestjs/common';
import { InvoiceManagerService } from '../../services/invoice-manager/invoice-manager.service';
import { prepareRequest } from 'src/modules/base/controllers/base/base.controller';

@Controller('invoice-manager')
export class InvoiceManagerController {
    constructor(
        private invoiceManagerService: InvoiceManagerService,

    ) { }

    // @Post('get-invoices-by-date-range')
    // getInvoicesByDateRange(@Body() body:any, @Headers() headers){

    // }

    @Post('date-range/:id/:field')
    getSingleUserInvoicesByDateRange(@Body() body: any, @Headers() headers, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ headers, payload: body, id });

        payload.payload.field = field;
        return this.invoiceManagerService.getSingleUserInvoicesByDateRange(payload);
    }

    @Post('dateRange/:id/:field/download')
    async downloadinvoiceAsPDF(@Body() body: any, @Headers() headers: any, @Param('id') id: string, @Param('field') field: string, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers, id });
        payload.payload.field = field;

        const document = await this.invoiceManagerService.downloadSingleUserInvoice(payload);
        const { fileName, pdfBuffer } = document;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
    }

    @Post('dateRange/:id/:field/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ payload: body, headers, id });
        payload.payload.field = field;

        const send = this.invoiceManagerService.sendSingleUserInvoiceToEmail(payload);
        return true;
        // return invoice;
    }
    @Post('dateRange/:id/:field/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ payload: body, headers, id });
        payload.payload.field = field;
        const invoice = await this.invoiceManagerService.printSingleUserInvoice(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(invoice); // Send the HTML content
    }


    @Post('one/:id/download')
    async donwloadOneInvoice(@Body() body: any, @Headers() headers: any, @Param('id') id: string, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers, id });
        const document = await this.invoiceManagerService.downloadOneInvoice(payload);
        const { fileName, pdfBuffer } = document;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
    }

    @Post('one/:id/email')
    async sendOneEmail(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string, @Param('field') field: string) {
        const payload = prepareRequest({ payload: body, headers, id });
        payload.payload.field = field;

        const send = this.invoiceManagerService.sendOneInvoicetoEmail(payload);
        return true;
        // return invoice;
    }
    @Post('one/:id/print')
    async printOne(@Body() body: any, @Headers() headers: any, @Res() res: any, @Param('id') id: string) {
        const payload = prepareRequest({ payload: body, headers, id });
        const invoice = await this.invoiceManagerService.printOneInvoice(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(invoice); // Send the HTML content
    }

    @Post('pay')
    async payInvoice(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const invoice = await this.invoiceManagerService.payForInvoice(payload);
        return invoice;
    }

    @Post('pending-invoices')
    async pendingInvoices(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const invoice = await this.invoiceManagerService.getPendingInvoices(payload);
        return invoice;
    }

    @Post('all-invoices')
    async allInvoices(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const invoice = await this.invoiceManagerService.getAllInvoices(payload);
        return invoice;
    }
    @Post('pay-for-multiple')
    async payForMultipleInvoices(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const invoice = await this.invoiceManagerService.payForMultipleInvoices(payload);
        return invoice;
    }

    // payForMultipleInvoices
}


