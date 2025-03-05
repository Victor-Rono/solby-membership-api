/* eslint-disable prettier/prettier */
import { combineHtmlTextsInline } from "src/shared/functions/templates.functions";
import { OrganizationInterface } from "src/shared/interfaces/organization.interface";
import { DateRangeInterface } from "victor-dev-toolbox";

export function comprehensiveReportTemplate(payload: { organization: OrganizationInterface, htmlParts: string[], dateRange: DateRangeInterface }) {
    const { organization, htmlParts, dateRange } = payload;

    // const fullHtml = `${htmlParts[0]}`
    const fullHtml = `
    <div>
    <h1>${organization.shortName.toUpperCase()} COMPREHENSIVE REPORT</h1>
    <p>From ${dateRange.startDate} To ${dateRange.stopDate}</p>
     <div>
      ${combineHtmlTextsInline(htmlParts)}
     </div>
    </div>
    `;
    return fullHtml;
}