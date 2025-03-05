/* eslint-disable prettier/prettier */
import { getFirstDayOfTheMonthUntilToday, getItemsWithinDateRange } from 'victor-dev-toolbox';
import { Injectable } from '@nestjs/common';
import { generateUniqueId } from 'src/database/database.functions';
import { DatabaseCollectionEnums, DBRequestInterface, QueryCollectionInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { SalesEventsEnum } from '../sales-automation/sales-events.enums';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceRevenueInterface, InvoiceUserTypeEnum } from 'src/modules/invoices/invoices.interface';
import { validateInvoiceFields } from 'src/shared/functions/invoices.functions';
import { getItemsCreatedToday, getTotalForField, jumpToXNumberOfDays, sortArrayByKey } from 'victor-dev-toolbox';
import { getAllDaysWithinDateRange, getBeginningOfDayFromDate, getFullDateRange } from 'src/shared/functions/date-time.functions';
import { BarChartInterface, PieChartInterface } from 'src/shared/interfaces/apex.interface';
import { DateRangeInterface } from 'src/shared/interfaces/dates.interface';
import { DebtorInterface } from 'src/shared/interfaces/debtors.interface';
import { SalesDashboardInterface } from 'src/shared/interfaces/sales-dashboard.interface';

@Injectable()
export class MtSalesService extends BaseService<any, any, any, any> {

    // override async getAll(organizationId: string): Promise<MT_SaleInterface[]> {
    //     const fields = { field: 'category', value: InvoiceCategoryEnum.SALE }
    //     const sales = await this.getByField({ organizationId, payload: fields });

    //     return sales
    // }

    async cashSale(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { sale, products } = payload;
        const item = sale as MT_SaleInterface;
        item.category = InvoiceCategoryEnum.SALE
        item.invoiceType = InvoiceEnums.CASH_SALE
        const id = generateUniqueId();
        sale.items = products;
        const finalSale = await this.addDebtorDetails(organizationId, sale);
        const invoice = validateInvoiceFields(finalSale);

        const saveSale = await this.create({ id, organizationId, payload: invoice });

        const record: MT_SaleRecordInterface = {

            saleId: saveSale.id,
            id: generateUniqueId(),
            items: products,
            createdBy: "SYSTEM"
        };

        this.eventEmitter.emit(SalesEventsEnum.SALE_MADE, { record, organizationId, sale: saveSale });
        return saveSale;

    }

    async creditSale(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { sale, products } = payload;
        const item = sale as MT_SaleInterface;
        item.category = InvoiceCategoryEnum.SALE
        item.invoiceType = InvoiceEnums.CREDIT_SALE
        const id = generateUniqueId();

        sale.items = products;

        const finalSale = await this.addDebtorDetails(organizationId, sale);
        const saveSale = await this.create({ id, organizationId, payload: finalSale });

        const record: MT_SaleRecordInterface = {

            saleId: saveSale.id,
            id: generateUniqueId(),
            items: products,
            createdBy: "SYSTEM"
        };

        this.eventEmitter.emit(SalesEventsEnum.SALE_MADE, { record, organizationId, sale: saveSale });
        return saveSale;

    }

    private async addDebtorDetails(organizationId: string, invoice: InvoiceInterface): Promise<InvoiceInterface> {
        const debtor: DebtorInterface = await this.databaseService.getItem({ id: invoice.sellerId || 'none', organizationId, collection: DatabaseCollectionEnums.CREDITORS });
        if (debtor) {
            invoice.sellerId = debtor.id;
            invoice.sellerName = debtor.name;
            invoice.email = debtor.email;
            invoice.sellerPhone = debtor.phone;
            invoice.userType = InvoiceUserTypeEnum.DEBTOR;
        }
        return invoice;
    }


    async clean(request: DBRequestInterface) {
        const query = request as QueryCollectionInterface;
        const clean = await this.databaseService.deleteCollection(query)
    }


    async dashboard(request: DBRequestInterface) {
        const { organizationId } = request;
        const previousDay = jumpToXNumberOfDays({ daysToJump: -1 });

        const promises: any[] = [
            // this.getTodayInvoices(organizationId)
            this.databaseService.getItemsByDateRange({ organizationId, startDate: previousDay, stopDate: new Date().toISOString(), fieldToCheck: 'day', collection: DatabaseCollectionEnums.INVOICES }),
        ];

        const resolved = await Promise.all(promises);

        const invoices: InvoiceInterface[] = resolved[0];




        const todayInvoices = await getItemsWithinDateRange({
            items: invoices,
            dateRange: getFullDateRange({ startDate: previousDay, stopDate: new Date().toISOString() }),
            fieldToCheck: 'day',
        });

        // const todayInvoices = invoices;
        // return todayInvoices;

        const todayData = this.getTodayData(todayInvoices);
        const dashboard: SalesDashboardInterface = {
            totalCash: todayData.totalCash,
            highestSale: todayData.highestSale,
            totalCredit: todayData.totalCredit,
            outStandingPayment: todayData.outStandingPayment,
            totalPurchases: todayData.totalPurchases,
            highestPurchase: todayData.highestPurchase,
            purchaseTransactions: todayData.purchaseTransactions,
            todayTransactions: todayInvoices,
            monthlySalesChart: this.getMonthlySalesChart(todayInvoices),
            salesBreakdown: todayData.salesBreakdown,
            dailySalesGrowth: todayData.totalPaidPurchases,
            cashTransactions: todayData.cashTransactions,
            creditTransactions: todayData.creditTransactions,
            remainingPurchasesBalance: todayData.remainingPurchaseBalance,
        };

        return dashboard;
    }

    private async getTodayInvoices(organizationId: string) {
        const allInvoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.INVOICES });
        // return allInvoices;
        const startOfDay = getBeginningOfDayFromDate(new Date().toISOString());
        const endTime = new Date(new Date().toISOString());
        endTime.setHours(23, 59, 59);
        const endOfDay = endTime.toISOString();
        const filtered = allInvoices.filter(invoice => invoice.createdAt >= startOfDay && invoice.createdAt <= endOfDay);
        return filtered;
    }



    private getTodayData(invoices: InvoiceInterface[]) {

        const cashSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CASH_SALE);
        const creditSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CREDIT_SALE);
        const purchases = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.PURCHASE);
        const totalCash = getTotalForField(cashSales, 'amountPaid');
        const sorted = sortArrayByKey('amountPaid', 'DESC', creditSales.concat(cashSales));
        const highestSale = (sorted[0])?.amountPaid || 0;
        const sortedPurchases = getTotalForField(purchases, 'amountPaid');
        const highestPurchase = (sortedPurchases[0])?.amountPaid || 0;
        const totalAmountToPay = getTotalForField(creditSales, 'totalAmount');
        const totalCredit = getTotalForField(creditSales, 'totalAmount');
        const purchaseTransactions = purchases.length;


        const totalPaidCreditSales = getTotalForField(creditSales, 'amountPaid');
        const outStandingPayment = totalAmountToPay - totalPaidCreditSales;

        const totalPurchasesAmount = getTotalForField(purchases, 'totalAmount');
        const totalPaidPurchases = getTotalForField(purchases, 'amountPaid');
        const remainingPurchaseBalance = totalPurchasesAmount - totalPaidPurchases;



        return {
            totalCash,
            highestSale,
            totalCredit,
            cashTransactions: cashSales.length,
            creditTransactions: creditSales.length,
            totalPurchases: totalPurchasesAmount,
            outStandingPayment,
            totalPaidPurchases,
            recentPurchases: purchases.slice(0, 5),
            highestPurchase,
            purchaseTransactions,
            salesBreakdown: this.salesBreakdown(invoices),
            remainingPurchaseBalance,
        }
    }

    private salesBreakdown(invoices: InvoiceInterface[]) {
        const creditSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CREDIT_SALE);
        const cashSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CASH_SALE);
        const purchases = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.PURCHASE);

        const pieChart: PieChartInterface = {
            labels: ['Cash Sales', 'Credit Sales', 'Purchases'],
            series: [getTotalForField(cashSales, 'totalAmount'), getTotalForField(creditSales, 'totalAmount'), getTotalForField(purchases, 'totalAmount')],
            // title: 'Credit And Cash Sales',
            // width?: number,
            // height?: number,
        }

        return pieChart;
    }

    private getMonthlySalesChart(invoices: InvoiceInterface[]) {
        // const cashSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CASH_SALE);
        // const creditSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CREDIT_SALE);
        const range = getFirstDayOfTheMonthUntilToday();
        const newDateRange: DateRangeInterface = {
            startDate: new Date(range.startDate).toISOString(),
            stopDate: new Date(range.stopDate).toISOString(),
        }
        const dates = getAllDaysWithinDateRange(newDateRange);
        const labels = dates;

        const series: any[] = [];
        // dates.forEach(d => {
        //     const startOfDay = new Date(getBeginningOfDayFromDate(d)).toISOString();
        //     const filtered = invoices.filter(invoice => {

        //         const invoiceDate = new Date(invoice.day).toISOString();

        //         return invoiceDate === startOfDay;
        //     });



        //     const total = getTotalForField(filtered, 'amountPaid');

        //     series.push(total);
        // });
        const barChart: BarChartInterface = {
            labels,
            series,
            // title: 'Credit And Cash Sales',
            // width?: number,
            // height?: number,
        }

        return barChart;

        // const purchases = invoices.filter(invoice => invoice.
    }


}
