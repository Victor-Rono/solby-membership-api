/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { PieChartInterface } from 'src/shared/interfaces/apex.interface';
import { ExpenseCategoryInterface, GroupedExpensesInterface, MT_ExpenseInterface, MT_ExpensesDashboardInterface } from 'src/shared/interfaces/MT-expenses.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { dayMonthYear, generateUniqueId, getFieldValuesFromArray, getTotalForField, resolveMultiplePromises, sortArrayByKey } from 'victor-dev-toolbox';
import { expensesTable } from '../../templates/expenses-table.template';
import { expensesTemplate } from '../../templates/expenses.template';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { LedgerTypeEnums, LedgerInterface } from 'src/shared/interfaces/ledger.interface';
import { MT_SaleInterface } from 'src/shared/interfaces/MT-sales.interface';

@Injectable()
export class MtExpensesService extends BaseService<any, any, any, any> {
    constructor(
        private pdfService: PdfService,
        private emailsService: EmailsService
    ) {
        super();
    }


    override async create(createDTO: CreateRequestInterface): Promise<any> {
        const { organizationId } = createDTO;
        const expense = await super.create(createDTO);
        const save = this.saveToLedger({ organizationId, expense });
        return expense;
    }

    async getDashboard(request: DBRequestInterface): Promise<MT_ExpensesDashboardInterface> {

        const data = await this.getExpensesData(request);
        const { expenses, categories, totalExpenses } = data;

        const chartData = this.createPieChardata(expenses, categories);
        const sorted = sortArrayByKey('amount', 'DESC', expenses);
        const highestExpense = (sorted[0])?.amount || 0;
        const dashboard: MT_ExpensesDashboardInterface = {
            totalExpenses,
            expenses,
            chartData,
            averageExpenses: totalExpenses / expenses.length || 0,
            highestExpense

        }
        return dashboard;
    }

    private createPieChardata(expenses: MT_ExpenseInterface[], categories: ExpenseCategoryInterface[]): PieChartInterface {
        const labels: string[] = [];
        const series: number[] = [];

        categories.forEach(c => {
            const filtered = expenses.filter(e => e.categoryId === c.id);
            const total = getTotalForField(filtered, 'amount');
            labels.push(c.name);
            series.push(total);
        });
        const chartData: PieChartInterface = {
            labels,
            series,
        }
        return chartData;
    }



    async generateAsPdf(request: DBRequestInterface) {
        const htmlTemplate = await this.getHtmlTemplate(request);
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const fileName = `Expenses Report - ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`;
        const pdf = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate, });
        return pdf;

    }

    async sendExpenseReportToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate, emails } = payload;

        // const { emails } = payload;
        if (!emails || emails.length === 0) {
            // throw new Error("No emails provided");
            return false;
        }
        const pdf = await this.generateAsPdf(request);
        const email: EmailInterface = {
            subject: `Income Statement, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            html: `Income Statement, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            recipients: emails,
            attachments: [{
                filename: pdf.fileName,
                content: pdf.pdfBuffer,
                contentType: 'application/pdf',
            }]
        }
        const send = this.emailsService.sendEmail(email);
        return true;

    }

    private async getHtmlTemplate(request: DBRequestInterface): Promise<string> {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        const promises: any[] = await resolveMultiplePromises([
            this.getExpensesData(request),
            this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS, }),
        ]);

        const [expensesData, organization] = promises;

        const { expenses, categories, totalExpenses } = expensesData;

        const groupedExpenses: GroupedExpensesInterface[] = [];

        categories.forEach((c: ExpenseCategoryInterface) => {
            const filtered = expenses.filter(e => e.categoryId === c.id);
            const total = getTotalForField(filtered, 'amount');
            groupedExpenses.push({
                categoryId: c.id,
                categoryName: c.name,
                expenses: filtered,
                total,
            })
        })

        const html = expensesTemplate({ organization, grouped: groupedExpenses, total: totalExpenses, dateRange: { startDate, stopDate } });
        return html;
    }

    async printExpenses(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const html = await this.getHtmlTemplate(request);
        return html;

    }



    async getExpensesData(request: DBRequestInterface) {

        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;

        const promises: any[] = await resolveMultiplePromises(
            [
                this.databaseService.getItemsByDateRange({ organizationId, startDate, stopDate, fieldToCheck: "day", collection: DatabaseCollectionEnums.MT_EXPENSES }),

                this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MT_EXPENSE_CATEGORIES, }),
                this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
            ]
        );
        const expenses: MT_ExpenseInterface[] = sortArrayByKey('createdAt', 'DESC', promises[0]);
        const categories: ExpenseCategoryInterface[] = sortArrayByKey('name', 'ASC', promises[1]);
        const organization = promises[2];

        const totalExpenses = getTotalForField(expenses, 'amount');
        return {
            expenses,
            categories,
            totalExpenses,
        }
    }

    private async saveToLedger(payload: { organizationId: string, expense: MT_ExpenseInterface }) {
        const { organizationId, expense } = payload;
        const type = LedgerTypeEnums.EXPENSE;
        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type,
            amount: expense.amount * -1,
            description: type,
            accountId: expense.id,
            saleId: expense.id,
            accountName: expense.categoryName,
            createdBy: 'system',
            sellerId: 'N/A',
            buyerId: organizationId,
        };
        const save = await this.databaseService.createItem({ id: generateUniqueId(), itemDto: ledger, collection: DatabaseCollectionEnums.LEDGER, organizationId });
    }
}
