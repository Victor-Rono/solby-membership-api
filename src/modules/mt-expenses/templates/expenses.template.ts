/* eslint-disable prettier/prettier */
import { GroupedExpensesInterface, MT_ExpenseInterface } from "src/shared/interfaces/MT-expenses.interface";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { expensesTable } from "./expenses-table.template";
import { DateRangeInterface, dayMonthYear, getTotalForField } from "victor-dev-toolbox";

export function expensesTemplate(payload: {
    organization: OrganizationInterface,
    grouped: GroupedExpensesInterface[],
    total: number,
    dateRange: DateRangeInterface
}) {
    const { grouped, organization, total, dateRange } = payload;
    const { startDate, stopDate } = dateRange;


    const template = `
        <div style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 16px; color: #613506; background-color:white;">
            <header style="margin-bottom: 24px;">
                <h1 style="color: #613506; margin-bottom: 8px; font-size: 24px; font-family: Arial, sans-serif;">
                    ${organization.shortName} - Expenses Report
                </h1>
                <p style="color: #613506; font-size: 16px; margin: 0; font-family: Arial, sans-serif;">
                    Expense report for period: ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}
                </p>
            </header>

                  <footer style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e8c78a; font-family: Arial, sans-serif;">
                <div style="text-align: right; font-family: Arial, sans-serif;">
                    <span style="color: #613506; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;">
                        Total Expenses: ${'KES ' + total.toFixed(2)}
                    </span>
                </div>
            </footer>

            ${grouped.filter(gr => gr.expenses.length).map((g: GroupedExpensesInterface) => `
                <section style="margin-bottom: 32px; font-family: Arial, sans-serif;">
                    <div style="color: #613506; font-family: Arial, sans-serif; flex; justify-content: space-between; width: 100%;">
                   <div style="font-weight:bold  font-size: 20px; bold; font-family: Arial, sans-serif; padding:2px;">
                        ${g.categoryName}
                   </div>

            
                    </div>
                    
                    ${expensesTable(g.expenses)}
                    
                    <div style="text-align: right; margin-top: 8px; padding: 8px; background-color: #e8c78a20; font-family: Arial, sans-serif;">
                        <span style="color: #613506; font-weight: bold; font-family: Arial, sans-serif;">
                            Subtotal: : ${'KES ' + g.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                        </span>
                    </div>
                </section>
            `).join('')}

            <footer style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e8c78a; font-family: Arial, sans-serif;">
                <div style="text-align: right; font-family: Arial, sans-serif;">
                    <span style="color: #0000; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;">
                        Total Expenses: ${'KES ' + total.toFixed(2)}
                    </span>
                </div>
            </footer>
        </div>
    `;

    return template;
}