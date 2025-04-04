/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createNotification } from 'src/shared/functions/notifications.functions';
import {
  CreateRequestInterface,
  DatabaseCollectionEnums,
  DBRequestInterface,
} from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { generateUniqueId } from 'src/database/database.functions';
import {
  DateRangeInterface,
  dayMonthYear,
  getEnumValues,
  getTotalForField,
  sortArrayByKey,
} from 'victor-dev-toolbox';
import {
  AccountInterface,
  AccountingEnum,
  IncomeStatementInterface,
  DefaultAccountEnums,
  AccountSummaryInterface,
} from '../../accounting.interface';
import { AccountEventsEnum } from '../accounting-automation/accounting-events.enums';
import {
  LedgerInterface,
  LedgerTypeEnums,
} from 'src/shared/interfaces/ledger.interface';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { PettyCashService } from 'src/modules/petty-cash/services/petty-cash/petty-cash.service';
import { LedgerService } from 'src/modules/ledger/services/ledger/ledger.service';
import {
  ExpenseCategoryInterface,
  MT_ExpenseInterface,
} from 'src/shared/interfaces/MT-expenses.interface';
import { MT_RevenueInterface, RevenueCategoryInterface } from 'src/shared/interfaces/MT-revenues.interface';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { incomeStatementTemplate } from '../../templates/income-statement.template';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { InvoicesService } from 'src/modules/invoices/services/invoice/invoices.service';

@Injectable()
export class AccountingService extends BaseService<any, any, any, any> {
  collection: DatabaseCollectionEnums = DatabaseCollectionEnums.ACCOUNTING;

  constructor(
    private invoiceService: InvoicesService,
    // private pettyCashService: PettyCashService,
    private ledgerService: LedgerService,
    private pdfService: PdfService,
    private emailService: EmailsService,
  ) {
    super();
  }

  override async getAll(organizationId: string): Promise<AccountInterface[]> {
    const accounts = await super.getAll(organizationId);
    const sorted = sortArrayByKey('name', 'ASC', accounts);
    return sorted;
  }

  // Add Account
  override async create(payload: CreateRequestInterface) {
    const { organizationId, payload: account } = payload;

    return new Promise<any>(async (resolve, reject) => {
      const accountsWithSimilarName = await this.getByField({
        organizationId,
        payload: { field: 'name', value: account.name },
      });
      if (accountsWithSimilarName.length) {
        const notification = createNotification(
          'error',
          'An Account with a similar name already exists',
        );
        resolve({ notification });
        return;
      }
      const id = account.id || generateUniqueId();
      super
        .create({ id, payload: account, organizationId })
        .then((res) => {
          const notification = createNotification(
            'success',
            'Account Added Successfully',
          );
          res.notification = notification;
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async transferFunds(payload: DBRequestInterface) {
    const {
      organizationId,
      payload: { fromAccount, toAccount, amount },
    } = payload;
    const from = await this.getById({ id: fromAccount, organizationId });
    const to = await this.getById({ id: toAccount, organizationId });

    const fromAmount = from.amount || 0;
    const toAmount = to.amount || 0;
    if (fromAmount < amount) {
      throw new Error('Insufficient funds');
      // const notification = createNotification('error', 'Insufficient funds');
      // return { notification };
    }
    const fromNewAmount = fromAmount - amount;
    const toNewAmount = toAmount + amount;

    const fromUpdate = await this.update({
      id: fromAccount,
      organizationId,
      payload: { amount: fromNewAmount },
    });
    const toUpdate = await this.update({
      id: toAccount,
      organizationId,
      payload: { amount: toNewAmount },
    });

    const ledgerRecords = { organizationId, fromAccount, toAccount, amount };
    const save = await this.saveTransfersToLedger(ledgerRecords);
    // this.eventEmitter.emit(AccountEventsEnum.TRANSFER_FUNDS, ledgerRecords);
    return save;
  }

  async saveTransfersToLedger(payload: {
    organizationId: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) {
    const accounts = await this.databaseService.getAllItems({
      organizationId: payload.organizationId,
      collection: DatabaseCollectionEnums.ACCOUNTING,
    });
    const from = accounts.find((account) => account.id === payload.fromAccount);
    const to = accounts.find((account) => account.id === payload.toAccount);

    const description = `Transfer from ${from.name} Account to ${to.name} Account`;
    const fromLedger: LedgerInterface = {
      id: generateUniqueId(),
      type: LedgerTypeEnums.FUNDS_TRANSFER,
      accountId: payload.fromAccount,
      amount: -payload.amount,
      accountName: from.name,
      description,
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      buyerId: to.id,
      sellerId: from.id,
    };

    const toLedger: LedgerInterface = {
      id: generateUniqueId(),
      type: LedgerTypeEnums.FUNDS_TRANSFER,
      accountId: payload.toAccount,
      amount: payload.amount,
      description,
      accountName: to.name,
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      buyerId: from.id,
      sellerId: to.id,
    };

    const promises: any[] = [
      this.databaseService.createItem({
        id: generateUniqueId(),
        organizationId: payload.organizationId,
        collection: DatabaseCollectionEnums.LEDGER,
        itemDto: fromLedger,
      }),
      this.databaseService.createItem({
        id: generateUniqueId(),
        organizationId: payload.organizationId,
        collection: DatabaseCollectionEnums.LEDGER,
        itemDto: toLedger,
      }),
    ];
    return resolveMultiplePromises(promises);
  }

  async addFunds(data: DBRequestInterface) {
    const { organizationId, payload } = data;
    const { accountId, amount, description } = payload;
    const account = await this.getById({ id: accountId, organizationId });
    const newAmount = (account.amount || 0) + amount;
    const update = await this.update({
      id: accountId,
      organizationId,
      payload: { amount: newAmount },
    });
    payload.organizationId = organizationId;
    this.eventEmitter.emit(AccountEventsEnum.ADD_FUNDS, payload);
    return update;
  }

  getInvoiceRevenue(request: DBRequestInterface) {
    return this.invoiceService.getInvoiceRevenues(request);
  }

  getUserInvoices(request: DBRequestInterface) {
    return this.invoiceService.getUserInvoices(request);
  }

  async getIncomeStatement(
    request: DBRequestInterface,
  ): Promise<IncomeStatementInterface> {
    const { organizationId, payload } = request;
    const { startDate, stopDate } = payload;
    const expenseAndRevenueSummaries =
      await this.getAccountSummariesForRevenuesAndExpenses(request);

    const ledgerSummaries = await this.ledgerService.getLedgers(
      organizationId,
      payload,
    );
    const accountSummaries = ledgerSummaries.concat(expenseAndRevenueSummaries).filter(s => s.amount);
    const incomeAccounts = accountSummaries.filter(
      (account) => account.accountType === AccountingEnum.REVENUE,
    );
    const expenseAccounts = accountSummaries.filter(
      (account) => account.accountType === AccountingEnum.EXPENDITURE,
    );



    // Build the income statement
    return {
      startDate,
      stopDate,
      incomeAccounts,
      expenseAccounts,
      totalRevenue: getTotalForField(incomeAccounts, 'amount'),
      totalExpenses: getTotalForField(expenseAccounts, 'amount') * -1,
      chart: {}, // Chart logic can be added here if required
    };
  }

  override async deleteRecord(payload: DBRequestInterface): Promise<any> {
    const idsToAvoid: string[] = getEnumValues(DefaultAccountEnums) as string[];
    if (idsToAvoid.includes(payload.id)) {
      throw new HttpException(
        'Cannot delete this record',
        HttpStatus.BAD_REQUEST,
      );
    }
    return super.deleteRecord(payload);
  }

  async getAccountSummariesForRevenuesAndExpenses(request: DBRequestInterface) {
    const { organizationId, payload } = request;
    const { startDate, stopDate } = payload;

    const categories = await resolveMultiplePromises([
      this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MT_EXPENSE_CATEGORIES, }),
      this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MT_REVENUE_CATEGORIES })
    ]);

    // const memberContributions = await ;

    const expenseCategories: ExpenseCategoryInterface[] = categories[0];
    const revenueCategories: RevenueCategoryInterface[] = categories[1];

    const summaries: AccountSummaryInterface[] = [];

    const allSummaries = await resolveMultiplePromises([
      this.getAccountSummariesForExpenses(request, expenseCategories),
      this.getAccountSummariesForRevenues(request, revenueCategories),
      this.getAccountSummariesForInvoices(request, { startDate, stopDate })
    ]);

    const expenseSummaries: AccountSummaryInterface[] = allSummaries[0];
    const revenueSummaries = allSummaries[1];
    const memberContributions: AccountSummaryInterface = allSummaries[2];
    return expenseSummaries.concat(summaries).concat(revenueSummaries);
  }
  private async getAccountSummariesForInvoices(request: DBRequestInterface, range: DateRangeInterface): Promise<AccountSummaryInterface> {
    const { organizationId, payload } = request;
    const invoices = await this.databaseService.getItemsByDateRange({ organizationId, collection: DatabaseCollectionEnums.INVOICES, startDate: range.startDate, stopDate: range.stopDate });
    const memberInvoices = invoices.filter(i => i.sellerId === organizationId);
    const organizationInvoices = invoices.filter(i => i.sellerId !== organizationId);
    const memberSummary: AccountSummaryInterface = {
      accountId: 'member',
      accountType: AccountingEnum.REVENUE,
      name: "Member Contributions",
      amount: getTotalForField(memberInvoices, 'amountPaid'),
    }
    console.log({ memberSummary, memberInvoices });

    return memberSummary;
  }

  async getAccountSummariesForExpenses(
    request: DBRequestInterface,
    expenseCategories: ExpenseCategoryInterface[],
  ) {
    const { organizationId, payload } = request;
    const { startDate, stopDate } = payload;
    const summaries: AccountSummaryInterface[] = [];
    const expenses: MT_ExpenseInterface[] =
      await this.databaseService.getItemsByDateRange({
        organizationId,
        collection: DatabaseCollectionEnums.MT_EXPENSES,
        startDate,
        stopDate,
      });
    expenseCategories.forEach((c) => {
      const filtered = expenses.filter((e) => e.categoryId === c.id);
      const summary: AccountSummaryInterface = {
        accountId: c.id,
        accountType: AccountingEnum.EXPENDITURE,
        name: c.name,
        amount: getTotalForField(filtered, 'amount'),
      };
      summaries.push(summary);
    });
    return summaries;
  }

  async getAccountSummariesForRevenues(
    request: DBRequestInterface,
    revenueCategories: RevenueCategoryInterface[],
  ) {
    const { organizationId, payload } = request;
    const { startDate, stopDate } = payload;
    const summaries: AccountSummaryInterface[] = [];
    const revenues: MT_RevenueInterface[] =
      await this.databaseService.getItemsByDateRange({
        organizationId,
        collection: DatabaseCollectionEnums.MT_REVENUES,
        startDate,
        stopDate,
      });
    revenueCategories.forEach((c) => {
      const filtered = revenues.filter((e) => e.categoryId === c.id);
      const summary: AccountSummaryInterface = {
        accountId: c.id,
        accountType: AccountingEnum.REVENUE,
        name: c.name,
        amount: getTotalForField(filtered, 'amount'),
      };
      summaries.push(summary);
    });
    return summaries;
  }




  async getIncomeStatementHTML(request: DBRequestInterface): Promise<string> {
    const { organizationId } = request;
    const organiation = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
    const incomeStatement = await this.getIncomeStatement(request);
    const html = incomeStatementTemplate(incomeStatement, organiation);
    return html;
  }

  async downloadIncomeStatement(request: DBRequestInterface) {
    const { startDate, stopDate } = request.payload;
    const fileName = `Income Statement-From-${startDate}-to-${stopDate}.pdf`
    const html = await this.getIncomeStatementHTML(request);
    const pdf = await this.pdfService.generatePDFFromHTML({ fileName, html });
    return pdf;
  }

  async sendIncomeStatementEmail(request: DBRequestInterface) {
    const { emails, startDate, stopDate } = request.payload;
    const pdf = await this.downloadIncomeStatement(request);
    const email: EmailInterface = {
      subject: `Income Statement, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
      html: `Income Statement, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
      recipients: emails,
      attachments: [{
        filename: pdf.fileName,
        content: pdf.pdfBuffer,
        contentType: 'application/pdf',
      }]
    }
  }

  async printIncomeStatement(request: DBRequestInterface) {
    const { organizationId, payload } = request;
    const { startDate, stopDate } = payload;
    if (!startDate || !stopDate) {
      throw new Error('Start and stop dates are required');
    }
    const html = this.getIncomeStatementHTML(request);
    return html;

  }



}
