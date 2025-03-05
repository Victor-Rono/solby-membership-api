/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateRequestInterface, DBRequestInterface, DatabaseCollectionEnums } from 'src/database/database.interface';
import { EmailInterface } from 'src/INTEGRATIONS/emails/emails.interface';
import { EmailsService } from 'src/INTEGRATIONS/emails/services/emails/emails.service';
import { PdfService } from 'src/INTEGRATIONS/file-manager/services/pdf/pdf.service';
import { BaseService } from 'src/modules/base/base.service';
import { PieChartInterface } from 'src/shared/interfaces/apex.interface';
import { LedgerTypeEnums, LedgerInterface } from 'src/shared/interfaces/ledger.interface';
import { MT_RevenueInterface, MT_RevenuesDashboardInterface, RevenueCategoryInterface } from 'src/shared/interfaces/MT-revenues.interface';
import { sortArrayByKey, getTotalForField, dayMonthYear, resolveMultiplePromises, generateUniqueId } from 'victor-dev-toolbox';
// import { any } from 'src/shared/interfaces/MT-Revenues.interface';
import { revenuesTemplate } from '../../templates/revenues.template';

@Injectable()
export class MtRevenuesService extends BaseService<any, any, any, any> {
    constructor(
        private pdfService: PdfService,
        private emailsService: EmailsService
    ) {
        super();
    }


    override async create(createDTO: CreateRequestInterface): Promise<any> {
        const { organizationId } = createDTO;
        const Revenue = await super.create(createDTO);
        const save = this.saveToLedger({ organizationId, Revenue });
        return Revenue;
    }

    async getDashboard(request: DBRequestInterface): Promise<MT_RevenuesDashboardInterface> {

        const data = await this.getRevenuesData(request);
        const { revenues, categories, totalRevenues } = data;

        const chartData = this.createPieChardata(revenues, categories);
        const sorted = sortArrayByKey('amount', 'DESC', revenues);
        const highestRevenue = (sorted[0])?.amount || 0;
        const dashboard: MT_RevenuesDashboardInterface = {
            totalRevenues,
            revenues,
            chartData,
            averageRevenues: totalRevenues / revenues.length || 0,
            highestRevenue

        }
        return dashboard;
    }

    private createPieChardata(Revenues: MT_RevenueInterface[], categories: RevenueCategoryInterface[]): PieChartInterface {
        const labels: string[] = [];
        const series: number[] = [];

        categories.forEach(c => {
            const filtered = Revenues.filter(e => e.categoryId === c.id);
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
        const fileName = `Revenues Report - ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`;
        const pdf = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate, });
        return pdf;

    }

    async sendRevenueReportToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate, emails } = payload;

        // const { emails } = payload;
        if (!emails || emails.length === 0) {
            // throw new Error("No emails provided");
            return false;
        }
        const pdf = await this.generateAsPdf(request);
        const email: EmailInterface = {
            subject: `Revenue Report, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            html: `Revenue Report, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
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
            this.getRevenuesData(request),
            this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS, }),
        ]);

        const data = await this.getRevenuesData(request);
        const { revenues, categories, totalRevenues } = data;



        const [revenuesData, organization] = promises;

        // const { revenues, categories, totalRevenues } = revenuesData;
        const groupedRevenues: any[] = [];


        categories.forEach((c: RevenueCategoryInterface) => {
            const filtered = revenues.filter(e => e.categoryId === c.id);
            const total = getTotalForField(filtered, 'amount');
            groupedRevenues.push({
                categoryId: c.id,
                categoryName: c.name,
                revenues: filtered,
                total,
            })
        })

        const html = revenuesTemplate({ organization, grouped: groupedRevenues, total: totalRevenues, dateRange: { startDate, stopDate } });
        return html;
    }

    async printRevenues(request: DBRequestInterface) {

        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const html = await this.getHtmlTemplate(request);
        return html;

    }



    async getRevenuesData(request: DBRequestInterface) {

        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;

        const promises: any[] = await resolveMultiplePromises(
            [
                this.databaseService.getItemsByDateRange({ organizationId, startDate, stopDate, fieldToCheck: "day", collection: DatabaseCollectionEnums.MT_REVENUES }),
                this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MT_REVENUE_CATEGORIES, }),
                // this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
            ]
        );

        const revenues: MT_RevenueInterface[] = sortArrayByKey('name', 'ASC', promises[0]);
        const categories: RevenueCategoryInterface[] = sortArrayByKey('name', 'ASC', promises[1]);
        // const organization = promises[2];

        const totalRevenues = getTotalForField(revenues, 'amount');

        return {
            revenues,
            categories,
            totalRevenues,
        }
    }

    private async saveToLedger(payload: { organizationId: string, Revenue: MT_RevenueInterface }) {
        const { organizationId, Revenue } = payload;
        const type = LedgerTypeEnums.REVENUE;
        const ledger: LedgerInterface = {
            id: generateUniqueId(),
            type,
            amount: Revenue.amount * -1,
            description: type,
            accountId: Revenue.id,
            saleId: Revenue.id,
            accountName: Revenue.categoryName,
            createdBy: 'system',
            sellerId: 'N/A',
            buyerId: organizationId,
        };
        const save = await this.databaseService.createItem({ id: generateUniqueId(), itemDto: ledger, collection: DatabaseCollectionEnums.LEDGER, organizationId });
    }
}


