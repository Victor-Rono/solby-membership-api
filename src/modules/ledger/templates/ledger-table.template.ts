/* eslint-disable prettier/prettier */
import { LedgerBreakdownInterface } from "src/shared/interfaces/ledger.interface";
import { LedgerInterface } from "src/shared/interfaces/ledger.interface";
import { dayMonthYear } from "victor-dev-toolbox";

export function ledgerTableTemplate(
  ledgerEntries: LedgerInterface[]
): string {
  return `
    <div style="font-family: sans-serif; margin: 20px; color: #000;">
      <!-- Ledger Entries Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #e8c78a;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">No.</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Account</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Type</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Amount</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Description</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Date</th>
           
          </tr>
        </thead>
        <tbody>
          ${ledgerEntries
      .map((entry, index) => {
        return `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${index + 1}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.accountName}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.type}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left; color: ${entry.amount < 0 ? '#ff0000' : '#0b930b'};">
                    ${'KES ' + (entry.amount||0).toFixed(2)}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.description || 'N/A'}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${dayMonthYear(entry.createdAt)}</td>
             
                </tr>
              `;
      })
      .join('')}
        </tbody>
      </table>
    </div>
  `;
}
