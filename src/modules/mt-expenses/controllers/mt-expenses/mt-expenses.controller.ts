/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Res } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/base.controller';
import { MtExpensesService } from '../../services/mt-expenses/mt-expenses.service';

@Controller('mt-expenses')
export class MtExpensesController extends BaseController<any, any, any, any> {
    constructor(
        private readonly service: MtExpensesService,
    ) {
        super(service);
    }

    @Post('dashboard')
    async getDashboard(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        return this.service.getDashboard(payload);
    }


    @Post('document/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const document = await this.service.generateAsPdf(payload);
        const { fileName, pdfBuffer } = document;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
    }

    @Post('document/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const send = await this.service.sendExpenseReportToEmail(payload);
        return true;
        // return ledger;
    }
    @Post('document/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.service.printExpenses(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }
}
