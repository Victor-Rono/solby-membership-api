/* eslint-disable prettier/prettier */
import { LedgerBreakdownInterface, LedgerInterface } from "src/shared/interfaces/ledger.interface";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { DateRangeInterface, dayMonthYear } from "victor-dev-toolbox";
import { CreditorInterface } from "src/shared/interfaces/creditors.interface";
import { DebtorInterface } from "src/shared/interfaces/debtors.interface";
import { creditorHeaderTemplate } from "./creditor-header.template";
import { creditorsTableTemplate } from "./creditor-table.template";

export function creditorDocumentTemplate(payload: { title: string, organization: OrganizationInterface, items: CreditorInterface[] | DebtorInterface[], }): string {
  const { organization, items, title } = payload;
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
<h1 style="color: #613506; text-align: center; font-size: 24px; margin-bottom: 20px;">${title}</h1>
<div style="color:#077091; display:flex; justify-content:space-between; font-weight:bold; padding:5px;">
</div>
  ${creditorHeaderTemplate(items)}

  ${creditorsTableTemplate(items)}
  </div>
  </body>
  </html>
`

  return template;
}