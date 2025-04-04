/* eslint-disable prettier/prettier */
import { CreditorInterface } from "src/shared/interfaces/creditors.interface";
import { DebtorInterface } from "src/shared/interfaces/debtors.interface";

export function creditorsTableTemplate(
  items: CreditorInterface[] | DebtorInterface[]
): string {
  return `
    <div style="font-family: sans-serif; margin: 20px; color: #000;">
      <!-- Ledger Entries Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #e8c78a;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">No.</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Name</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Phone</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Email</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: #613506;">Outstanding Balance</th>
           
          </tr>
        </thead>
        <tbody>
          ${items
      .map((entry: CreditorInterface | DebtorInterface, index) => {
        return `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${index + 1}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.name}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.phone}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.email}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left; color: ${entry.outstandingBalance < 0 ? '#ff0000' : '#0b930b'};">
                    ${'KES ' + (entry.outstandingBalance || 0).toFixed(2)}
                  </td>             
                </tr>
              `;
      })
      .join('')}
        </tbody>
      </table>
    </div>
  `;
}
