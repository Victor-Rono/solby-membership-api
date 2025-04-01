/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res } from '@nestjs/common';
import { BaseController, prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { DBRequestInterface } from 'src/database/database.interface';
import { AccountingService } from './services/accounting/accounting.service';

@Controller('accounting')
export class AccountingController extends BaseController<any, any, any, any> {

    constructor(
        private accountingService: AccountingService,
    ) {
        super(accountingService);
    }

    @Post('transfer-funds')
    async transferFunds(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body });
        return this.accountingService.transferFunds(payload);
    }

    @Post('add-funds')
    addFunds(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body });
        return this.accountingService.addFunds(payload);
    }

    @Post('invoice-revenue')
    getInvoiceRevenue(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body }) as DBRequestInterface;
        return this.accountingService.getInvoiceRevenue(payload);
    }

    @Post('user-invoices')
    getUserInvoices(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body }) as DBRequestInterface;

        return this.accountingService.getUserInvoices(payload);
    }

    @Post('income-statement')
    getIncomeStatement(@Headers() headers: any, @Body() body: any) {
        const payload = prepareRequest({ headers, payload: body }) as DBRequestInterface;

        return this.accountingService.getIncomeStatement(payload)
    }

    @Post('income-statement/download')
    async downloadAsPDF(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const document = await this.accountingService.downloadIncomeStatement(payload);
        const { fileName, pdfBuffer } = document;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.send(pdfBuffer);
    }

    @Post('income-statement/email')
    async sendEmail(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });

        const send = await this.accountingService.sendIncomeStatementEmail(payload);
        return true;
        // return ledger;
    }
    @Post('income-statement/print')
    async print(@Body() body: any, @Headers() headers: any, @Res() res: any) {
        const payload = prepareRequest({ payload: body, headers });
        const ledger = await this.accountingService.printIncomeStatement(payload);
        // Send the HTML content back to the client
        res.setHeader('Content-Type', 'text/html'); // Ensure it's treated as HTML
        return res.send(ledger); // Send the HTML content
    }

}
