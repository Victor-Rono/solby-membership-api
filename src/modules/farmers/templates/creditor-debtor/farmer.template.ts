/* eslint-disable prettier/prettier */
import { LedgerBreakdownInterface, LedgerInterface } from "src/shared/interfaces/ledger.interface";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { DateRangeInterface, dayMonthYear } from "victor-dev-toolbox";
import { CreditorInterface } from "src/shared/interfaces/creditors.interface";
import { DebtorInterface } from "src/shared/interfaces/debtors.interface";
import { farmerHeaderTemplate } from "./farmer-header.template";
import { FarmerInterface } from "src/shared/interfaces/farmer.interface";
import { farmersTableTemplate } from "./farmer-table.template";
import { MemberInterface } from "src/shared/interfaces/members.interface";

export function farmerDocumentTemplate(payload: { title: string, organization: OrganizationInterface, items: MemberInterface[] }): string {
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
  ${farmerHeaderTemplate(items)}

  ${farmersTableTemplate(items)}
  </div>
  </body>
  </html>
`

  return template;
}