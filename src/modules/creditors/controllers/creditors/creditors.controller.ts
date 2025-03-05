/* eslint-disable prettier/prettier */
import { Controller, Post, Headers, Body, Param, Get, Res } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { CreditorsService } from '../../services/creditors/creditors.service';

@Controller('creditors')
export class CreditorsController extends BaseController<any, any, any, any> {
    constructor(
        private readonly creditorsService: CreditorsService,
    ) {
        super(creditorsService);
    }

    @Post('add-creditor')
    async addCreditor(@Body() payload: any, @Headers() headers: any,) {
        const request = prepareRequest({ headers, payload });
        const add = await this.creditorsService.addCreditor(request);
        return add;
    }

    @Get('invoices/pending/:id')
    async pendingInvoices(@Param('id') id, @Headers() headers: any,) {
        const payload = prepareRequest({ id, headers });
        return this.creditorsService.getAllPendingInvoices(payload);
    }
    @Post('report/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.creditorsService.downloadAsPDF(payload);
        const { fileName, pdfBuffer } = ledger;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
        // return ledger;
    }

    @Post('report/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.creditorsService.sendToEmail(payload);
        return true;
        // return ledger;
    }

    @Post('report/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.creditorsService.print(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }
}
