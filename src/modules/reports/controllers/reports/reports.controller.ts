/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Res, Headers } from '@nestjs/common';
import { ReportsService } from '../../services/reports/reports.service';
import { prepareRequest } from 'src/modules/base/base.controller';

@Controller('reports')
export class ReportsController {
    constructor(
        private reportsService: ReportsService,
    ) { }
    @Post('document/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.reportsService.downloadAsPDF(payload);
        const { fileName, pdfBuffer } = ledger;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
        // return ledger;
    }

    @Post('document/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.reportsService.sendToEmail(payload);
        return true;
        // return ledger;
    }

    @Post('document/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.reportsService.print(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }

}
