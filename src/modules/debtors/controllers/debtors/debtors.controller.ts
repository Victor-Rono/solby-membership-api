/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Headers, Post, Body, Res } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { DebtorsService } from '../../services/debtors/debtors.service';

@Controller('debtors')
export class DebtorsController extends BaseController<any, any, any, any> {
    constructor(
        private debtorsService: DebtorsService,
    ) {
        super(debtorsService)
    }

    @Get('invoices/pending/:id')
    async pendingInvoices(@Param('id') id, @Headers() headers: any,) {
        const payload = prepareRequest({ id, headers });
        return this.debtorsService.getAllPendingInvoices(payload);
    }
    @Post('report/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.debtorsService.downloadAsPDF(payload);
        const { fileName, pdfBuffer } = ledger;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
        // return ledger;
    }

    @Post('report/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.debtorsService.sendToEmail(payload);
        return true;
        // return ledger;
    }

    @Post('report/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.debtorsService.print(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }
}
