/* eslint-disable prettier/prettier */

// import { any } from "src/shared/interfaces/MT-revenues.interface";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { DateRangeInterface, dayMonthYear } from "victor-dev-toolbox";
import { InvoiceInterface } from "../invoices.interface";
import { totalForAllInvoices } from "src/shared/functions/invoices.functions";
import { invoicesTable } from "./invoices-table";
import { DebtorInterface } from "src/shared/interfaces/debtors.interface";
import { CreditorInterface } from "src/shared/interfaces/creditors.interface";



export function invoicesTemplate(payload: {
   user:DebtorInterface|CreditorInterface,
   organization:OrganizationInterface,
    invoiceType:string,
    invoices: InvoiceInterface[],
    dateRange: DateRangeInterface
}) {
    const { invoices, user, dateRange, invoiceType, organization } = payload;
    const { startDate, stopDate } = dateRange;
const total = totalForAllInvoices(invoices);
    const template = `
        <div style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 16px; color: #613506; background-color:white;">

<h1 style="font-weight:bold; text-align:center">${organization.shortName.toUpperCase()}</h1>

            <div style="margin-bottom: 24px;">
              
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100% !important; min-width:1000px;">
                <div>
                <div>From:</div>
                 <div>${organization.shortName}</div>
                 <div>${organization.phone||organization.phoneNumber}</div>
                <div>${user.email}</div>
                </div>

                    <div>
                <div>To:</div>
                <div>${user.name}</div>
                 <div>${user.phone}</div>
                <div>${user.email}</div>
                </div>
               
                </div>
                <p style="color: #613506; font-size: 16px; margin: 0; font-family: Arial, sans-serif;">
                 
                </p>
            </div>

            <div>
  <h3 style="color: #613506; margin-bottom: 8px; font-size: 24px; font-family: Arial, sans-serif;">
                    ${user.name}
                </h3>
<h3 style=" font-weight:bold">
 ${invoiceType}  Invoices for period: ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}
</h3>
</div>

                  <footer style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e8c78a; font-family: Arial, sans-serif;">
                <div style="text-align: right; font-family: Arial, sans-serif;">
            
                    <p style="color: blue !important; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;">
                    Total Amount: ${'KES ' + total.totalAmount.toFixed(2)}
                    </p>
                        <p style="color: red !important; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;">
                    Amount Paid: ${'KES ' + total.amountPaid.toFixed(2)}
                    </p>
                            <span style="color: #613506; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;">
                        Balance Due: ${'KES ' + total.totalDue.toFixed(2)}
                    </span>
                </div>
            </footer>

            <section style="margin-bottom: 32px; font-family: Arial, sans-serif;">
                    <div style="color: #613506; font-family: Arial, sans-serif; flex; justify-content: space-between; width: 100%;">
                   <div style="font-weight:bold  font-size: 20px; bold; font-family: Arial, sans-serif; padding:2px;">
                        Invoices
                   </div>

            
                    </div>
                    
                    ${invoicesTable(invoices)}
                    
                    <div style="text-align: right; margin-top: 8px; padding: 8px; background-color: #e8c78a20; font-family: Arial, sans-serif;">
                        <span style="color: #613506; font-weight: bold; font-family: Arial, sans-serif;">
                            Balance Due: ${'KES ' + total.totalDue.toFixed(2)}
                        </span>
                    </div>
                </section>

     

            <footer style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e8c78a; font-family: Arial, sans-serif;">
                <div style="text-align: right; font-family: Arial, sans-serif;">
                    <span style="color: #0000; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;">
                        Balance Due: ${'KES ' + total.totalDue.toFixed(2)}
                    </span>
                </div>
            </footer>
        </div>
    `;

    return template;
}