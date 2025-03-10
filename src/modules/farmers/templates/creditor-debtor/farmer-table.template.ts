/* eslint-disable prettier/prettier */

import { FarmerInterface } from "src/shared/interfaces/farmer.interface";


export function farmersTableTemplate(
  items: FarmerInterface[]
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
      .map((entry: FarmerInterface, index) => {
        return `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${index + 1}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.name}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.phone}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${entry.email}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: left; color: ${entry.balance < 0 ? '#ff0000' : '#0b930b'};">
                    ${'KES ' + (entry.balance || 0).toFixed(2)}
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
