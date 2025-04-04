/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { DatabaseService } from 'src/database/database.service';
import { AccountingService } from 'src/modules/accounting/services/accounting/accounting.service';
import { LedgerService } from 'src/modules/ledger/services/ledger/ledger.service';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { comprehensiveReportTemplate } from '../../templates/comprehensive-report.template';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { MtExpensesService } from 'src/modules/mt-expenses/services/mt-expenses/mt-expenses.service';
import { MtRevenuesService } from 'src/modules/mt-revenues/services/mt-revenues/mt-revenues.service';
import { CreditorsService } from 'src/modules/creditors/services/creditors/creditors.service';
import { DebtorsService } from 'src/modules/debtors/services/debtors/debtors.service';

@Injectable()
export class ReportsService {

    constructor(
        private accountingService: AccountingService,
        private ledgerService: LedgerService,
        private creditorsService: CreditorsService,
        private debtorsService: DebtorsService,
        private databaseService: DatabaseService,
        private emailService: EmailsService,
        private pdfService: PdfService,
        private expensesService: MtExpensesService,
        private revenuesService: MtRevenuesService,
    ) {
    }

    private async getReportsHtml(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS })
        const promises: any[] = [
            // income statement
            this.accountingService.printIncomeStatement(request),
            // Members
            this.debtorsService.print(request),
            // Ledger
            this.ledgerService.printLedger(request),
            // revenues
            // this.revenuesService.printRevenues(request),

            // Expenses
            // this.expensesService.printExpenses(request),

            // Creditors
            // this.creditorsService.print(request),

            // Milking
            // this.getMilkingRecordsTemplate(request),
        ];
        const resolved = await resolveMultiplePromises(promises);

        const htmlParts = resolved;

        const html = comprehensiveReportTemplate({ organization, htmlParts, dateRange: payload });
        return { organization, html };
    }

    async downloadAsPDF(request: DBRequestInterface) {
        const { organizationId } = request;
        const htmlTemplate = await this.getReportsHtml(request);
        const fileName = `${htmlTemplate.organization.shortName} Comprehensive Report`;
        const response = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate.html });
        return response;
    }

    async sendToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { emails } = payload;
        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }
        // const htmlTemplate = DocumentTemplate(Data);
        const fileName = `Comprehensive Report`;
        const pdf = await this.downloadAsPDF(request);
        const email: EmailInterface = {
            subject: pdf.fileName,
            html: pdf.fileName,
            recipients: emails,
            attachments: [{
                filename: fileName + `.pdf`,
                content: pdf.pdfBuffer,
                contentType: 'application/pdf'
            }]
        }
        const sendEmail = this.emailService.sendEmail(email);
        return true;
    }

    async print(request: DBRequestInterface) {
        const htmlTemplate = await this.getReportsHtml(request);
        return htmlTemplate.html;
    }

    // private getDocumentTitle(request: DBRequestInterface) {
    //     const { organizationId, payload } = request;
    //     const organization = await
    // }
    // private async getMilkingRecordsTemplate(request: DBRequestInterface) {
    //     const { organizationId, payload } = request;
    //     const { startDate, stopDate } = payload;
    //     request.payload.dateRange = { startDate, stopDate };
    //     return this.milkingService.print(request);
    // }

}
