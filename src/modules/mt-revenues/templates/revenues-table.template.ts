/* eslint-disable prettier/prettier */
import { MT_RevenueInterface } from "src/shared/interfaces/MT-revenues.interface";
import { dayMonthYear } from "victor-dev-toolbox";

export function revenuesTable(revenues: MT_RevenueInterface[]) {
  const table = `
    <div style="background-color: #ffffff; box-shadow: 0px 2px 4px rgba(97, 53, 6, 0.1); border-radius: 6px; padding: 8px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #61350610; color: #613506; text-transform: uppercase; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">#</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">Date</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">Description</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #61350620;">Amount</th>
          </tr>
        </thead>
        <tbody style="color: #613506; font-size: 14px;">
          ${revenues
      .map((revenue, index) => {
        return `
                <tr style="border-bottom:  1px solid #61350615; transition: background-color 0.2s">
                  <td style="padding: 12px 10px;">${index + 1}</td>
                  <td style="padding: 12px 10px;">${dayMonthYear(revenue.createdAt)}</td>
                  <td style="padding: 12px 10px;">${revenue.description}</td>
                  <td style="padding: 12px 10px; color: #black; text-align: right; font-weight:bold; font-family: 'Courier New', monospace;">${'KES ' + revenue.amount.toFixed(2)}</td>
                </tr>
              `;
      })
      .join("")}
        </tbody>
      </table>
    </div>
  `;

  return table;
}