/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Headers, Res } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { LedgerService } from '../../services/ledger/ledger.service';
import { format } from 'date-fns';

@Controller('ledger')
export class LedgerController extends BaseController<any, any, any, any> {
    constructor(private readonly ledgerService: LedgerService) {
        super(ledgerService);
    }

    @Post('general')
    async getGeneralLedger(@Body() body: any, @Headers() headers: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.ledgerService.generalLedgers(payload);
        return ledger;
    }

    @Post('general/download')
    async downloadLedgerAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.ledgerService.downloadLedgerAsPDF(payload);
        const { fileName, pdfBuffer } = ledger;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
        // return ledger;
    }

    @Post('general/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const ledger = await this.ledgerService.sendLedgerToEmail(payload);
        return true;
        // return ledger;
    }

    @Post('general/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.ledgerService.printLedger(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }
}
