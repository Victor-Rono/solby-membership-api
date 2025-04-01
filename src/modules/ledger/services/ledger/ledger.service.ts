/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import e from 'express';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { AccountingEnum, AccountInterface, AccountSummaryInterface, DefaultAccountEnums } from 'src/modules/accounting/accounting.interface';
import { VirtualAccounts } from 'src/modules/accounting/services/accounting/virtual-accounts.data';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceUserTypeEnum } from 'src/modules/invoices/invoices.interface';
import { getFullDateRange } from 'src/shared/functions/date-time.functions';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { LedgerBreakdownInterface, LedgerInterface, LedgerTypeEnums } from 'src/shared/interfaces/ledger.interface';
import { DateRangeInterface, dayMonthYear, generateUniqueId, getTotalForField, sortArrayByKey } from 'victor-dev-toolbox';
import { ledgerDocumentTemplate } from '../../templates/ledger.template';
import { format } from 'date-fns';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { TenantInterface } from 'src/modules/tenants/interfaces/tenants.interface';
import { getBeginningOfDayFromDate } from 'src/shared/functions/date-time.functions';

@Injectable()
export class LedgerService extends BaseService<any, any, any, any> {

    constructor(
        private pdfService: PdfService,
        private emailService: EmailsService,
    ) {
        super();
    }

    async getLedgerAsInvoices(organizationId: string) {
        const Ledgers = await this.getByField({ organizationId, payload: { field: 'type', value: LedgerTypeEnums.FUNDS_ADDED } });
        const invoices: InvoiceInterface[] = await this.convertLedgersToInvoices(organizationId, Ledgers);
        return invoices;
    }

    async getLedgers(organizationId: string, dateRange: DateRangeInterface) {
        const { startDate, stopDate } = dateRange;
        const promises: any[] = await resolveMultiplePromises(
            [
                this.getByDateRange({ organizationId, payload: { startDate, stopDate } }),
                this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.ACCOUNTING, }),
                this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),

            ]
        );
        const ledgers: LedgerInterface[] = promises[0];

        const accounts: AccountInterface[] = promises[1].concat(VirtualAccounts);

        const organization: OrganizationInterface | null = promises[2] || null;

        // const all = promises[2];



        const accountSummaries: AccountSummaryInterface[] = [];

        accounts.forEach(acc => {

            const inv = this.getAccountLedgersAsInvoices(acc, ledgers, organization);
            accountSummaries.push(inv);

        });

        return accountSummaries;


    }

    private getAccountLedgersAsInvoices(account: AccountInterface, ledgers: LedgerInterface[], organization: OrganizationInterface | null): AccountSummaryInterface {
        const filtered = ledgers.filter(l => l.accountId === account.id);
        // if (account.id === DefaultAccountEnums.LIVESTOCK_SALES) {
        // }
        const invoices = this.prepareSingleAccountLedger(account, filtered, organization);

        const summary: AccountSummaryInterface = {
            amount: getTotalForField(invoices, 'amountPaid'),
            accountId: account.id,
            name: account.name,
            accountType: account.accountType
        }

        return summary;
    }

    prepareSingleAccountLedger(account: AccountInterface, ledgers: LedgerInterface[], organization: OrganizationInterface | null): InvoiceInterface[] {
        const invoices: InvoiceInterface[] = [];
        const invoiceGroup = this.getTypeAndCategoryFromAccount(account);
        const { invoiceType, category, userType } = invoiceGroup;



        ledgers.forEach(l => {
            const invoice: InvoiceInterface = {
                id: generateUniqueId(),
                name: `${account.name} Ledger`,
                description: l.description,
                invoiceType,
                userType,
                items: [],
                totalAmount: l.amount,
                amountPaid: l.amount,
                currency: 'KES',
                buyerId: l.id,
                sellerId: l.id,
                accountId: account.id,
                day: getBeginningOfDayFromDate(l.createdAt),
                category,
                createdAt: l.createdAt,
                createdBy: l.createdBy,
                sellerName: account.name,
                buyerName: organization.shortName,
                email: organization.email,
            }
            invoices.push(invoice);
        });

        return invoices;
    }

    private getTypeAndCategoryFromAccount(account: AccountInterface) {

        if (account.accountType === AccountingEnum.EXPENDITURE) {
            return {
                category: InvoiceCategoryEnum.PURCHASE,
                invoiceType: InvoiceEnums.PURCHASE,
                userType: InvoiceUserTypeEnum.CREDITOR,
            }
        } else {
            return {
                category: InvoiceCategoryEnum.SALE,
                invoiceType: InvoiceEnums.CASH_SALE,
                userType: InvoiceUserTypeEnum.DEBTOR,
            }
        }
        // export enum AccountingEnum {
        //     REVENUE = 'Revenue',
        //     EXPENDITURE = 'Expenditure',
        // }
    }


    private async convertLedgersToInvoices(organizationId: string, Ledger: LedgerInterface[]): Promise<InvoiceInterface[]> {
        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }
        const invoices: InvoiceInterface[] = Ledger.map(p => { return this.convertLedgerToInvoice(organization, p) });
        return invoices;
    }


    private convertLedgerToInvoice(organization: TenantInterface, ledger: LedgerInterface) {
        const invoice: InvoiceInterface = {
            id: generateUniqueId(),
            name: "Funds Added",
            description: ledger.description,
            invoiceType: InvoiceEnums.PURCHASE,
            items: [],
            totalAmount: ledger.amount,
            amountPaid: ledger.amount,
            currency: 'KES',
            buyerId: ledger.saleId,
            sellerId: organization.id,
            sellerName: organization.shortName,
            buyerName: 'Organization',
            accountId: 'funds',
            day: getBeginningOfDayFromDate(ledger.createdAt),
            category: InvoiceCategoryEnum.PURCHASE,
            createdAt: ledger.createdAt,
            createdBy: ledger.createdBy,
            email: ledger.sellerId,
            userType: InvoiceUserTypeEnum.CREDITOR,
        }
        return invoice;
    }


    private calculateEarnings(organizationId: string, invoices: InvoiceInterface[]) {

        const orgInvoices = invoices.filter(i => i.buyerId === organizationId);
        const userInvoices = invoices.filter(i => i.buyerId !== organizationId);

        const totalRevenue = getTotalForField(userInvoices, 'amountPaid');
        const totalExpenses = getTotalForField(orgInvoices, 'amountPaid')

        const orgDebt = (getTotalForField(orgInvoices, 'totalAmount')) - (getTotalForField(orgInvoices, 'amountPaid'));
        const userDebt = (getTotalForField(userInvoices, 'totalAmount')) - (getTotalForField(userInvoices, 'amountPaid'));

        const result = { totalExpenses, totalRevenue, orgDebt, userDebt };

        return result;
    }

    async generalLedgers(request: DBRequestInterface): Promise<{ ledgers: LedgerInterface[], breakdown: LedgerBreakdownInterface }> {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error("Start date and Stop date are required");
        }
        const dateRange = getFullDateRange({ startDate, stopDate });
        const ledgers: LedgerInterface[] = await this.getByDateRange({ organizationId, payload: { startDate: dateRange.startDate, stopDate: dateRange.stopDate } });
        const breakdown = this.ledgersBreakdown(ledgers);
        return { ledgers: sortArrayByKey('createdAt', 'DESC', ledgers), breakdown };

    }

    private ledgersBreakdown(ledgers: LedgerInterface[]): LedgerBreakdownInterface {
        const expenseLedgers = ledgers.filter(l => l.amount < 0);
        const revenueLedgers = ledgers.filter(l => l.amount > 0);
        const expenses = getTotalForField(expenseLedgers, 'amount');
        const revenues = getTotalForField(revenueLedgers, 'amount');
        const netRevenue = revenues + expenses;

        const breakdown: LedgerBreakdownInterface = {
            expenses,
            revenues,
            netRevenue,
            expenseTransactions: expenseLedgers.length,
            revenueTransactions: revenueLedgers.length,
            totalTransactions: revenueLedgers.length + expenseLedgers.length
        }

        return breakdown;

    }


    private async getLedgerData(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;


        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }

        const ledgerInfo = await this.generalLedgers(request);
        const dateRange: DateRangeInterface = { startDate, stopDate };
        const ledgerData = { organization, ...ledgerInfo, dateRange };
        return ledgerData;
    }


    async downloadLedgerAsPDF(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        const fileName = `General Ledger Report ${dayMonthYear(startDate)} - ${dayMonthYear(stopDate)}.pdf`;
        const ledgerData = await this.getLedgerData(request);
        const htmlTemplate = ledgerDocumentTemplate(ledgerData);
        const response = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate });
        return response;
    }

    async sendLedgerToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { emails } = payload;
        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }
        const ledgerData = await this.getLedgerData(request);
        // const htmlTemplate = ledgerDocumentTemplate(ledgerData);

        const { startDate, stopDate } = payload;
        const fileName = `General Ledger Report ${dayMonthYear(startDate)} - ${dayMonthYear(stopDate)}`;

        const pdf = await this.downloadLedgerAsPDF(request);
        const email: EmailInterface = {
            subject: "General Ledger Report",
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

    async printLedger(request: DBRequestInterface) {
        const ledgerData = await this.getLedgerData(request);
        const htmlTemplate = ledgerDocumentTemplate(ledgerData);

        return htmlTemplate;
    }
}


