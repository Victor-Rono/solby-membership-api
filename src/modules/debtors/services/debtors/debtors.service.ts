/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { creditorDocumentTemplate } from 'src/modules/accounting/templates/creditor-debtor/creditor.template';
import { BaseService } from 'src/modules/base/base.service';
import { InvoiceInterface } from 'src/modules/invoices/invoices.interface';
import { DebtorInterface } from 'src/shared/interfaces/debtors.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { resolveMultiplePromises, getTotalForField, sortArrayByKey } from 'victor-dev-toolbox';

@Injectable()
export class DebtorsService extends BaseService<any, any, any, any> {

    constructor(
        private emailService: EmailsService,
        private pdfService: PdfService,
    ) {
        super();
    }


    override async getAll(organizationId: string) {
        return this.getdebtorsAndInvoices(organizationId);
    }

    override async getById(request: DBRequestInterface): Promise<any> {
        const debtor: DebtorInterface = await super.getById(request);
        if (!debtor) return null;
        const invoices = await this.getAllPendingInvoices(request);
        const totalAmount = getTotalForField(invoices, 'totalAmount');
        const amountPaid = getTotalForField(invoices, 'amountPaid');
        const balance = totalAmount - amountPaid;
        debtor.balance = balance;
        return debtor;
    }


    async getAllPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload, id } = request;
        // const {id:payload}

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$sellerId", organizationId] },
                    { $eq: ["$buyerId", id] }
                ]
            }
        };
        const invoices = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.INVOICES, query, organizationId });
        return sortArrayByKey('createdAt', 'ASC', invoices);
    }



    async getdebtorsAndInvoices(organizationId: string) {
        const debtors: DebtorInterface[] = [];
        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$sellerId", organizationId] }
                ]
            }
        };
        const promises: any[] = [
            super.getAll(organizationId),
            this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.INVOICES, query, organizationId })
        ];
        const resolved = await resolveMultiplePromises(promises);

        const allDebtors = resolved[0];
        const invoices: InvoiceInterface[] = resolved[1];
        allDebtors.forEach(c => {
            const filteredInvoices = invoices.filter(i => i.buyerId === c.id);
            const totalAmount = getTotalForField(filteredInvoices, 'totalAmount');
            const totalPaid = getTotalForField(filteredInvoices, 'amountPaid');
            const balance = totalAmount - totalPaid;
            c.balance = balance;
            debtors.push(c);
        })
        return sortArrayByKey('balance', 'DESC', debtors);
    }

    private async getDebtorsReportHtml(organizationId: string) {
        const title = 'Debtors Report';
        const items: DebtorInterface[] = await this.getAll(organizationId);
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const html = creditorDocumentTemplate({ title, items, organization });
        return html;
    }


    async downloadAsPDF(request: DBRequestInterface) {
        const { organizationId } = request;
        const fileName = `Debtors Report`;
        const htmlTemplate = await this.getDebtorsReportHtml(organizationId);
        const response = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate });
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
        const fileName = `Debtors Report`;
        const pdf = await this.downloadAsPDF(request);
        const email: EmailInterface = {
            subject: fileName,
            html: fileName,
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
        const htmlTemplate = this.getDebtorsReportHtml(request.organizationId);
        return htmlTemplate;
    }

}
