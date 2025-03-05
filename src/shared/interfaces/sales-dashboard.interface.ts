/* eslint-disable prettier/prettier */
import { InvoiceInterface } from "src/modules/invoices/invoices.interface";
import { PieChartInterface } from "./apex.interface";

export interface SalesDashboardInterface {
  totalCash: number,
  highestSale: number,
  totalCredit: number,
  outStandingPayment: number,
  totalPurchases: number,
  highestPurchase: number,
  cashTransactions: number,
  creditTransactions: number,
  purchaseTransactions: number,
  todayTransactions: InvoiceInterface[],
  salesBreakdown: PieChartInterface,
  monthlySalesChart: any,
  dailySalesGrowth: any,
  remainingPurchasesBalance: number,

}
