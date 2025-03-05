/* eslint-disable prettier/prettier */
import { LedgerBreakdownInterface, LedgerInterface } from "src/shared/interfaces/ledger.interface";
import { ledgerHeaderTemplate } from "./ledger-header.template";
import { ledgerTableTemplate } from "./ledger-table.template";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { DateRangeInterface, dayMonthYear } from "victor-dev-toolbox";

export function ledgerDocumentTemplate(payload: { organization: OrganizationInterface, ledgers: LedgerInterface[], breakdown: LedgerBreakdownInterface, dateRange: DateRangeInterface }): string {
  const { organization, ledgers, breakdown, dateRange } = payload;
  const { startDate, stopDate } = dateRange;
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ledger Report</title>
  </head>
  <body style="font-family: sans-serif; margin: 20px; color: #000; font-size: 20px;">
  <div>
<div >
<h2 style="color: #613506;">${organization.shortName.toUpperCase()}</h2>

</div>
<h1 style="color: #613506; text-align: center; font-size: 24px; margin-bottom: 20px;">Ledger Summary</h1>
<div style="color:#077091; display:flex; justify-content:space-between; font-weight:bold; padding:5px;">
<span>From: ${dayMonthYear(startDate)}</span> &nbsp;&nbsp;&nbsp;
 <span>To: ${dayMonthYear(stopDate)}</span>
</div>
  ${ledgerHeaderTemplate(payload.breakdown)}

  ${ledgerTableTemplate(payload.ledgers)}
  </div>
  </body>
  </html>
`

  return template;
}