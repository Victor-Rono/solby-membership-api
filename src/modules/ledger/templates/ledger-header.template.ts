/* eslint-disable prettier/prettier */
import { LedgerBreakdownInterface } from "src/shared/interfaces/ledger.interface";

export function ledgerHeaderTemplate(breakdown: LedgerBreakdownInterface): string {
  const {
    expenses,
    revenues,
    netRevenue,
    expenseTransactions,
    revenueTransactions,
    totalTransactions,
  } = breakdown;

  return `
 
   <div>
    
    <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
      <p style="margin: 5px 0; font-size: 16px;">
        <span style="color: #2f4fd0;">Total Expenses:</span>
        <span style="color: #ff0000;">${'KES ' + expenses.toFixed(2)}</span>
      </p>
      <p style="margin: 5px 0; font-size: 16px;">
        <span style="color: #2f4fd0;">Total Revenues:</span>
        <span style="color: #0b930b;">${'KES ' + revenues.toFixed(2)}</span>
      </p>
      <p style="margin: 5px 0; font-size: 16px;">
        <span style="color: #2f4fd0;">Net Revenue:</span> 
        <span style="color: ${netRevenue >= 0 ? '#0b930b' : '#ff0000'};">
          ${'KES ' + netRevenue.toFixed(2)}
        </span>
      </p>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 20px;">
        <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
          <p style="margin: 0; font-size: 14px;">
            <span style="color: #2f4fd0;">Expense Transactions:</span> 
            <span">${expenseTransactions}</span>
          </p>
        </div>
        <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
          <p style="margin: 0; font-size: 14px;">
            <span style="color: #2f4fd0;">Revenue Transactions:</span> 
            <span">${revenueTransactions}</span>
          </p>
        </div>
        <div style="grid-column: span 2; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
          <p style="margin: 0; font-size: 14px;">
            <span style="color: #2f4fd0;">Total Transactions:</span> 
            <span">${totalTransactions}</span>
          </p>
        </div>
      </div>
    </div>
   </div>

  `;
}
