/* eslint-disable prettier/prettier */
import { dayMonthYear } from "victor-dev-toolbox";
import { totalForSingleInvoice } from "src/shared/functions/invoices.functions";
import { InvoiceItemsInterface } from 'src/modules/invoices/invoices.interface';

export function invoiceItemsTable(items: InvoiceItemsInterface[]) {
  const invoices = items || [];
  const table = `
    <div style="background-color: #ffffff; box-shadow: 0px 2px 4px rgba(97, 53, 6, 0.1); border-radius: 6px; padding: 8px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #61350610; color: #613506; text-transform: uppercase; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">#</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">Item</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">Quantity</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">Unit Price</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #61350620;">total</th>
          </tr>
        </thead>
        <tbody style="color: #613506; font-size: 14px;">
          ${invoices
      .map((invoice, index) => {
        // const total = totalForSingleInvoice(invoice);
        return `
                <tr style="border-bottom:  1px solid #61350615; transition: background-color 0.2s">
                  <td style="padding: 12px 10px; text-align: left;">${index + 1}</td>
                  <td style="padding: 12px 10px; text-align: left;">${invoice.name}</td>
                  <td style="padding: 12px 10px; text-align: left;"> X ${invoice.quantity}</td>
                  <td style="padding: 12px 10px; text-align: left;">${invoice.unitPrice}</td>
                  <td style="padding: 12px 10px; text-align: left;">${invoice.total}</td>
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