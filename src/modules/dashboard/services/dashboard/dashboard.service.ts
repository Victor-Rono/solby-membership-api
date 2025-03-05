/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { DashboardInterface } from '../../dashboard.interface';
import { DatabaseCollectionEnums } from '../../../../database/database.interface';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { resolveMultiplePromises, getFieldValuesFromArray, getItemsCreatedOnSpecifiedDay, getItemsCreatedToday, getTotalForField, sortArrayByKey } from 'victor-dev-toolbox';
import { InvoiceInterface } from '../../../invoices/invoices.interface';
import { ProductSaleInterface } from 'src/shared/interfaces/sale.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';

@Injectable()
export class DashboardService {
    constructor(
        private databaseService: DatabaseService,


    ) { }

    async getDashboardData(organizationId: string): Promise<DashboardInterface> {
        const dashboard: DashboardInterface = await this.databaseService.getItem({ id: 'dashboard', collection: DatabaseCollectionEnums.DASHBOARD, organizationId });
        return dashboard;
    }

    async getLatestDashboardData(organizationId: string) {
        const data = await this.prepareDashboardData(organizationId);
        return data;
    }


    async prepareDashboardForAllOrganizations() {
        const orgs: OrganizationInterface[] = await this.databaseService.getAllItems({ organizationId: '', collection: DatabaseCollectionEnums.ORGANIZATIONS });

        const ids = getFieldValuesFromArray('id', orgs);
        const promises: any[] = [];
        for (const id of ids) {
            promises.push(this.prepareDashboardData(id));
        }

        const results = await resolveMultiplePromises(promises);

    }



    async prepareDashboardData(organizationId: string) {
        // this.livestocKService.prepareDashboardData(organizationId);
        const promises: any[] = [
            this.getSalesYesterdayAndToday(organizationId), //2
        ];

        const resolved = await resolveMultiplePromises(promises);

        const { todaySales, yesterdaSales, recentActivities } = resolved[0];


        const dashboardData: DashboardInterface = {
            // Livestock

            totalRevenue: (todaySales?.totalRevenues || 0) + todaySales?.totalAmount,
            recentActivities,




        };

        dashboardData.donut = this.createDonutChart(dashboardData);
        const save = await this.saveDashboardData(organizationId, dashboardData);

        return dashboardData || save;

    }


    private createDonutChart(dashboard: DashboardInterface) {
        const creditSales = 0;
        const cashSales = 0;
        const purchases = 0;
        return { cashSales, creditSales, purchases }
    }


    async saveDashboardData(organizationId: string, deata: any) {
        const id = 'dashboard';
        const getDashboard = await this.databaseService.getItem({ id, collection: DatabaseCollectionEnums.DASHBOARD, organizationId });

        if (getDashboard) {
            await this.databaseService.updateItem({ id, collection: DatabaseCollectionEnums.DASHBOARD, organizationId, itemDto: deata });
        } else {
            await this.databaseService.createItem({ id, collection: DatabaseCollectionEnums.DASHBOARD, organizationId, itemDto: deata });
        }
    }





    private getPastDates(number: number) {
        const dates: string[] = []; //made dates type string
        const today = new Date(); // Get current date
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00

        for (let i = 0; i < number; i++) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000); // Subtract i days
            const formattedDate = date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
            dates.push(formattedDate);
        }

        return dates;
    }


    // Sold Today
    private async getSalesToday(organizationId: string,) {

        const invoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.INVOICES });
        const records = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.PRODUCT_SALES });


        const sold = invoices.filter(invoice => invoice.buyerId !== organizationId);
        const filtered = getItemsCreatedToday(sold, 'createdAt');

        const totalRevenues = getTotalForField(filtered, 'totalAmount');
        const paidAmount = getTotalForField(filtered, 'paidAmount');

        // const revenue = totalRevenues - paidAmount;
        const revenue = totalRevenues;
        // const  revenue;


        const todayRecords = getItemsCreatedToday(records, 'createdAt');
        const totalLitres = getTotalForField(todayRecords, 'quantity');
        const totalAmount = getTotalForField(todayRecords, 'totalAmount');

        const totalRevenue = totalAmount + revenue;

        return {
            totalLitres,
            totalRevenues: totalRevenue
        };
    }





    private async getSalesYesterdayAndToday(organizationId: string) {

        const invoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.INVOICES });
        const productSales: ProductSaleInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.PRODUCT_SALES });
        const milkSales = productSales.filter(sale => sale.productId === 'milk');
        const today = new Date().toISOString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const todaySales = this.getSalesFromSpecifiedDay({ organizationId, date: today, invoices, productSales: milkSales });
        const yesterdaySales = this.getSalesFromSpecifiedDay({ organizationId, date: yesterday.toISOString(), invoices, productSales: milkSales });


        const filtered = invoices.filter(i => i && i.invoiceType && i.invoiceType.toLowerCase().includes('sale'));

        const recentActivities = sortArrayByKey('createdAt', 'DESC', filtered).slice(0, 7);

        return {
            todaySales,
            yesterdaySales,
            recentActivities,
        }
    }


    private getSalesFromSpecifiedDay(payload: { organizationId: string, date: string, invoices: InvoiceInterface[], productSales: ProductSaleInterface[] }) {
        const { organizationId, date, invoices, productSales } = payload;
        //  Total Revenue
        const sold = invoices.filter(invoice => invoice.buyerId !== organizationId);
        const filtered = getItemsCreatedOnSpecifiedDay({ items: sold, keyToFilter: 'createdAt', date });
        const totalRevenues = getTotalForField(filtered, 'totalAmount');

        // Total Litres Sold
        const daySales = getItemsCreatedOnSpecifiedDay({ items: productSales, keyToFilter: 'createdAt', date });
        const totalLitres = getTotalForField(daySales, 'quantity');

        return {
            totalLitres,
            totalRevenues,
        };
    }

}
