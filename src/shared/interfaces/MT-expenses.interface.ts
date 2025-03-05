/* eslint-disable prettier/prettier */
import { PieChartInterface } from "./apex.interface";
import { RecordInterface } from "./record.interface";

export interface MT_ExpenseInterface extends RecordInterface {
  categoryId: string,
  categoryName: string,
  description: string,
  amount: number,
  recipient?: string,
  recipientPhone?: string,

}

export interface ExpenseCategoryInterface extends RecordInterface {
  name: string,
  description: string,
  // amount: number,
}


export interface ExpenseCategoryStatInterface {
  categoryId: string,
  categoryName: string,
  amount: number,
}



export interface MT_ExpensesDashboardInterface {
  totalExpenses: number,
  averageExpenses: number,
  highestExpense: number,
  expenses: MT_ExpenseInterface[],
  chartData: PieChartInterface,

}

export interface GroupedExpensesInterface {
  categoryId: string,
  categoryName: string,
  expenses: MT_ExpenseInterface[],
  total: number,
}
