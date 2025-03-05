/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { DatabaseService } from 'src/database/database.service';
import { EmailsService } from 'src/INTEGRATIONS/emails/services/emails/emails.service';
import { PdfService } from 'src/INTEGRATIONS/file-manager/services/pdf/pdf.service';
import { dayMonthYear, filterByDateRange, getItemsWithinDateRange, sortArrayByKey } from 'victor-dev-toolbox';
import { InvoiceDetailsInterface, InvoiceEnums, InvoiceInterface, InvoiceParticipantInterface } from '../../invoices.interface';
import { invoicesTemplate } from '../../templates/invoices.template';
import { EmailInterface } from 'src/INTEGRATIONS/emails/emails.interface';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { singleInvoiceTemplate } from '../../templates/single-invoice.template';
import { generateUniqueId } from 'src/database/database.functions';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { DebtorInterface } from 'src/shared/interfaces/debtors.interface';
import { CreditorInterface } from 'src/shared/interfaces/creditors.interface';
import { AccountingEnum, AccountInterface, DefaultAccountEnums } from 'src/modules/accounting/accounting.interface';
import { LedgerInterface } from 'src/shared/interfaces/ledger.interface';
import { MT_Transaction_Enums } from 'src/shared/interfaces/payment.interface';
import { getFullDateRange } from 'src/shared/functions/date-time.functions';
const collection = DatabaseCollectionEnums.INVOICES;
@Injectable()
export class InvoiceManagerService {
    constructor(
        private pdfService: PdfService,
        private emailsService: EmailsService,
        private databaseService: DatabaseService,
    ) { }

    async getSingleUserInvoicesByDateRange(request: DBRequestInterface) {
        const { organizationId, payload, id } = request;
        const { startDate, stopDate, field } = payload;

        const query = {
            // where field = field, value = id
            // where date >= startdate <= stopDate
        }

        const invoices = await this.databaseService.getItemsByField({ organizationId, field, value: id, collection });
        const filtered = await getItemsWithinDateRange({ dateRange: { startDate, stopDate }, items: invoices, fieldToCheck: 'createdAt' });

        return sortArrayByKey('createdAt', 'DESC', filtered);
    }


    private async getSingleUserInvoiceHTML(request: DBRequestInterface): Promise<string> {
        const { organizationId, payload, id } = request;



        const { startDate, stopDate, field } = payload;
        let invoiceType = 'Creditor'
        let collection = DatabaseCollectionEnums.CREDITORS;
        if (field === 'buyerId') {
            collection = DatabaseCollectionEnums.DEBTORS;
            invoiceType = 'Debtor';
        }
        const resolved = await resolveMultiplePromises([
            this.getSingleUserInvoicesByDateRange(request),
            this.databaseService.getItemsByField({ organizationId, field: 'id', value: id, collection }),
            this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
        ]);

        const invoices: InvoiceInterface[] = resolved[0];
        const users = resolved[1];
        const user = users[0] || null;
        const organization = resolved[2];
        const html = invoicesTemplate({ invoices, organization, user, dateRange: { startDate, stopDate }, invoiceType });
        return html;
    }

    async downloadSingleUserInvoice(request: DBRequestInterface) {
        const { startDate, stopDate } = request.payload;
        const fileName = `Invoices-from-${startDate}-to-${stopDate}`;
        const html = await this.getSingleUserInvoiceHTML(request);
        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName });
        return pdf;
    }


    async sendSingleUserInvoiceToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate, emails } = payload;

        // const { emails } = payload;
        if (!emails || emails.length === 0) {
            // throw new Error("No emails provided");
            return false;
        }
        const html = await this.getSingleUserInvoiceHTML(request);

        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName: `Invoices-from-${startDate}-to-${stopDate}` });


        const email: EmailInterface = {
            subject: `Invoices, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            html: `Invoices, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            recipients: emails,
            attachments: [{
                filename: `Invoices-from-${startDate}-to-${stopDate}.pdf`,
                content: pdf.pdfBuffer,
                contentType: 'application/pdf'
            }]
        }
        const send = this.emailsService.sendEmail(email);

        return true;

    }


    async printSingleUserInvoice(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const html = await this.getSingleUserInvoiceHTML(request);
        return html;

    }


    private async getOnInvoiceHTML(payload: DBRequestInterface) {
        const { id, organizationId } = payload;
        const invoiceDetails: InvoiceDetailsInterface = await this.getSingleInvoiceDetails(payload);
        const { from, to, organization, invoice } = invoiceDetails;

        if (!invoice) {
            return `Invoice not found`;
        }
        const html = singleInvoiceTemplate(invoiceDetails);
        return html;
    }

    async printOneInvoice(payload: DBRequestInterface) {
        const html = await this.getOnInvoiceHTML(payload);
        return html;
    }


    async downloadOneInvoice(payload: DBRequestInterface) {
        const fileName = `Invoice.pdf`;
        const html = await this.getOnInvoiceHTML(payload);
        const pdf = await this.pdfService.generatePDFFromHTML({
            fileName,
            html
        });
        return pdf;
    }

    async sendOneInvoicetoEmail(request: DBRequestInterface) {
        const { emails } = request.payload;


        const html = await this.getOnInvoiceHTML(request);
        const fileName = `Invoice.pdf`;
        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName });

        const email: EmailInterface = {
            subject: fileName,
            recipients: emails,
            html: `Invoice`,
            attachments: [
                {
                    filename: `Invoice`,
                    content: pdf.pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]


        }
        const send = this.emailsService.sendEmail(email);
        return true;
    }


    async getSingleInvoiceDetails(request: DBRequestInterface): Promise<InvoiceDetailsInterface> {
        const { id, organizationId } = request;

        const promises: any[] = [
            this.databaseService.getItem({ id, organizationId, collection }),
            this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
        ]

        const resolved = await resolveMultiplePromises(promises);
        const invoice: InvoiceInterface = resolved[0];
        const organization: OrganizationInterface = resolved[1];
        let organizationIsBuyer = false;
        let userId = invoice.buyerId;

        let from: InvoiceParticipantInterface | null = null;
        let to: InvoiceParticipantInterface | null = null;

        if (invoice.buyerId === organizationId) {
            organizationIsBuyer = true;
            userId = invoice.sellerId;
        }
        const debtorOrCreditor = await this.getDebtorOrCreditor({ organizationId, id: userId });


        if (organizationIsBuyer) {

            from = {
                name: debtorOrCreditor?.name || 'N/A',
                phone: debtorOrCreditor?.phone || 'N/A',
                email: debtorOrCreditor?.email || 'N/A'
            };
            to = {
                name: organization?.shortName || 'N/A',
                email: organization?.email || 'N/A',
                phone: organization?.phoneNumber || organization.phone || 'N/A',
            };
        } else {
            to = {
                name: debtorOrCreditor?.name || 'N/A',
                phone: debtorOrCreditor?.phone || 'N/A',
                email: debtorOrCreditor?.email || 'N/A'
            };
            from = {
                name: organization?.shortName || 'N/A',
                email: organization?.email || 'N/A',
                phone: organization?.phoneNumber || organization.phone || 'N/A',
            };
        }
        return { from, to, organization, invoice }



    }

    async getDebtorOrCreditor(payload: { organizationId: string, id: string }): Promise<DebtorInterface | CreditorInterface | null> {
        const { organizationId, id } = payload;
        const promises = [
            this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.CREDITORS }),
            this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.DEBTORS }),
            this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.FARMERS }),
        ];
        const resolved = await resolveMultiplePromises(promises);
        const debtorOrCreditor = resolved[0] || resolved[1] || resolved[2] || null;
        return debtorOrCreditor;
    }

    async payForInvoice(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        let { amountPaid } = payload;
        amountPaid = Math.abs(amountPaid);
        const { id } = payload;
        // let overpaid = false;
        const invoice: InvoiceInterface | null = await this.databaseService.getItem({ organizationId, id, collection });

        // if (!invoice.amountPaid || (invoice?.amountPaid || 0) > invoice.totalAmount) {
        //     overpaid = true;
        //     if (invoice.amountPaid > 0) {
        //         amountPaid = amountPaid * -1;
        //     }
        // }
        // const incoice
        if (!invoice) return false;
        const invoiceType = invoice.invoiceType;
        const newAmount = (invoice.amountPaid || 0) + amountPaid;


        const update = await this.databaseService.updateItem({ id, organizationId, itemDto: { amountPaid: newAmount }, collection });

        this.updateAcountBalance({ organizationId, invoice, amountPaid });
        return update;

    }

    async updateAcountBalance(payload: { organizationId: string, invoice: InvoiceInterface, amountPaid: number }) {
        const { organizationId, invoice, amountPaid } = payload;
        let amount = amountPaid;
        // const { id, amountPaid } = payload;

        const invoiceTypesToUpdate = [InvoiceEnums.CASH_SALE, InvoiceEnums.CREDIT_SALE, InvoiceEnums.PURCHASE];
        const { accountId } = invoice;
        if (!accountId) throw new Error('Account Id is missing');
        if (!invoiceTypesToUpdate.includes(invoice.invoiceType)) return;

        const account: AccountInterface | null = await this.getAccount({ organizationId, id: accountId });
        if (!account) return;
        if (accountId === InvoiceEnums.PURCHASE) {
            amount = amount * -1;
        }
        const newBalance = account.amount + amount;
        const update = await this.databaseService.updateItem({ id: accountId, organizationId, itemDto: { amount: newBalance }, collection: DatabaseCollectionEnums.ACCOUNTING });
        // Save to Ledger
        const ledger = await this.saveToLedger({ organizationId, invoice, amountPaid: amount });

    }

    async saveToLedger(payload: { organizationId: string, invoice: InvoiceInterface, amountPaid: number }) {
        const { organizationId, invoice, amountPaid } = payload;
        const invoiceTypesToUpdate = [InvoiceEnums.CASH_SALE, InvoiceEnums.CREDIT_SALE, InvoiceEnums.PURCHASE];
        const { accountId } = invoice;

        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type: MT_Transaction_Enums.CREDIT,
            amount: amountPaid,
            description: `Payment For Invoice ${invoice.serialNumber}`,
            accountId: invoice.accountId,
            saleId: invoice.id,
            accountName: accountId,
            ref: invoice.serialNumber,
            buyerId: invoice.buyerId,
            sellerId: invoice.sellerId,
            createdAt: new Date().toISOString(),
            createdBy: invoice.createdBy,
        }
        const save = await this.databaseService.createItem({ organizationId, id: generateUniqueId(), collection: DatabaseCollectionEnums.LEDGER, itemDto: ledger });

        return save;

    }

    private async getAccount(payload: { organizationId: string, id: string }) {
        const { organizationId, id } = payload;
        const account: AccountInterface | null = await this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.ACCOUNTING });

        if (account) return account;

        const name = id.replace('-', ' ');

        const revenueAccounts = [DefaultAccountEnums.CASH_SALES, DefaultAccountEnums.CREDIT_SALES, DefaultAccountEnums.INCOMING_REFUNDS, DefaultAccountEnums.LIVESTOCK_SALES];

        const newAccount: AccountInterface = {
            id,
            name,
            amount: 0,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            bankName: 'N/A',
            accountNumber: 'N/A',
            bankBranch: 'N/A',
            accountType: revenueAccounts.includes((id as any)) ? AccountingEnum.REVENUE : AccountingEnum.EXPENDITURE,
            description: '',
        }
        const save = await this.databaseService.createItem({ organizationId, id: generateUniqueId(), collection: DatabaseCollectionEnums.ACCOUNTING, itemDto: newAccount });
        return save;

    }

    async getPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const fullRange = getFullDateRange(payload);
        const { startDate, stopDate } = fullRange;

        // const query = {
        //     $expr: {
        //         $and: [
        //             { $gt: ["$totalAmount", "$amountPaid"] },
        //             { $gt: ["$amountPaid", "$totalAmount"] },
        //             { $gte: ["$day", startDate] },
        //             { $lte: ["$day", stopDate] },
        //         ],
        //     }
        // };

        const query = {
            $expr: {
                $and: [
                    { $ne: ["$totalAmount", "$amountPaid"] }, // Ensures values are not equal
                    { $gte: ["$createdAt", startDate] },
                    { $lte: ["$createdAt", stopDate] },
                ],
            }
        };

        const invoices = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });

        return invoices;
    }

    async getAllInvoices(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const fullRange = getFullDateRange(payload);
        const { startDate, stopDate } = fullRange;

        // const query = {
        //     $expr: {
        //         $and: [
        //             { $gt: ["$totalAmount", "$amountPaid"] },
        //             { $gt: ["$amountPaid", "$totalAmount"] },
        //             { $gte: ["$day", startDate] },
        //             { $lte: ["$day", stopDate] },
        //         ],
        //     }
        // };

        const query = {
            $expr: {
                $and: [
                    { $gte: ["$createdAt", startDate] },
                    { $lte: ["$createdAt", stopDate] },
                ],
            }
        };

        const invoices = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });

        return invoices;
    }
}
