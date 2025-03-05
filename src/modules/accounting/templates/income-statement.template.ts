/* eslint-disable prettier/prettier */
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { dayMonthYear } from "victor-dev-toolbox";
import { IncomeStatementInterface } from "../accounting.interface";

export function incomeStatementTemplate(statement: IncomeStatementInterface, organization: OrganizationInterface): string {
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Income Statement</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: white; color: #333;">
      <div style="max-width: 1200px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px;">
          <h1 style="color: #613506; text-align: center; margin-bottom: 30px;">${organization.shortName.toUpperCase()} INCOME STATEMENT</h1>
  
             <!-- Net Income Section -->
          <div style="background-color: #e8c78a; padding: 20px; border-radius: 6px; text-align: center;">
              <h3 style="color: #613506; margin: 0 0 10px 0;">Net Income</h3>
              <p id="netIncome" style="font-size: 24px; margin: 0; color: #41672d; font-weight: bold;">KES ${statement.totalRevenue + statement.totalExpenses}</p>
          </div>
        
        
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; flex: 1; margin-right: 10px;">
                  <h3 style="color: #41672d; margin: 0 0 10px 0;">Period</h3>
                  <p style="margin: 5px 0;">Start Date: <span id="startDate" style="color: #077091;">${dayMonthYear(statement.startDate)}</span></p>
                  <p style="margin: 5px 0;">End Date: <span id="endDate" style="color: #077091;">${dayMonthYear(statement.stopDate)}</span></p>
              </div>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; flex: 1; margin-left: 10px;">
                  <h3 style="color: #41672d; margin: 0 0 10px 0;">Summary</h3>
                  <p style="margin: 5px 0;">Total Revenue: <span id="totalRevenue" style="color: #0b930b;">${statement.totalRevenue}</span></p>
                  <p style="margin: 5px 0;">Total Expenses: <span id="totalExpenses" style="color: #ff0000;">${statement.totalExpenses}</span></p>
              </div>
          </div>
  
          <!-- Revenue Section -->
          <div style="margin-bottom: 30px;">
              <h2 style="color: #41672d; border-bottom: 2px solid #e8c78a; padding-bottom: 10px;">Revenues</h2>
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                  <table style="width: 100%; border-collapse: collapse;">
                      <thead>
                          <tr style="border-bottom: 2px solid #613506;">
                              <th style="text-align: left; padding: 10px; color: #613506;">Name</th>
                              <th style="text-align: right; padding: 10px; color: #613506;">Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                      ${statement.incomeAccounts.map(acc => `
                          <tr>
                              <td style="text-align: left; padding: 10px; color: #613506;">${acc.name}</td>
                              <td style="text-align: right; padding: 10px; color: #613506;">${acc.amount}</td>
                          </tr>`).join('')}
                      </tbody>
                  </table>
              </div>
          </div>
  
          <!-- Expenses Section -->
          <div style="margin-bottom: 30px;">
              <h2 style="color: #41672d; border-bottom: 2px solid #e8c78a; padding-bottom: 10px;">Expenses</h2>
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                  <table style="width: 100%; border-collapse: collapse;">
                      <thead>
                          <tr style="border-bottom: 2px solid #613506;">
                              <th style="text-align: left; padding: 10px; color: #613506;">Name</th>
                              <th style="text-align: right; padding: 10px; color: #613506;">Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                      ${statement.expenseAccounts.map(acc => `
                          <tr>
                              <td style="text-align: left; padding: 10px; color: #613506;">${acc.name}</td>
                              <td style="text-align: right; padding: 10px; color: #613506;">${acc.amount}</td>
                          </tr>`).join('')}
                      </tbody>
                  </table>
              </div>
          </div>
  
     
      </div>
  </body>
  </html>
    `;
}
