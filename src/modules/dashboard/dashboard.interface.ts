/* eslint-disable prettier/prettier */

import { InvoiceInterface } from "../invoices/invoices.interface"

export interface DashboardDonutInterface {
    cashSales: number,
    creditSales: number,
    purchases: number
}
export interface DashboardInterface {
    // Milking
    totalRevenue: number,
    recentActivities: InvoiceInterface[],


    // chart
    donut?: DashboardDonutInterface,

}
