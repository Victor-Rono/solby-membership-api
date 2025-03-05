/* eslint-disable prettier/prettier */
import { PieChartInterface } from "./apex.interface";
import { RecordInterface } from "./record.interface";

export interface MT_RevenueInterface extends RecordInterface {
  categoryId: string,
  categoryName: string,
  description: string,
  amount: number,
  recipient?: string,
  recipientPhone?: string,

}

export interface RevenueCategoryInterface extends RecordInterface {
  name: string,
  description: string,
  // amount: number,
}


export interface RevenueCategoryStatInterface {
  categoryId: string,
  categoryName: string,
  amount: number,
}



export interface MT_RevenuesDashboardInterface {
  totalRevenues: number,
  averageRevenues: number,
  highestRevenue: number,
  revenues: MT_RevenueInterface[],
  chartData: PieChartInterface,

}

// export interface any {
//   categoryId: string,
//   categoryName: string,
//   revenues: MT_RevenueInterface[],
//   total: number,
// }