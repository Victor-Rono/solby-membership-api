/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface, CreateRequestInterface, MultipleFieldRequestInterface, FieldValueRequestInterface } from 'src/database/database.interface';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { BaseService } from 'src/modules/base/base.service';
import { farmerDocumentTemplate } from 'src/modules/farmers/templates/creditor-debtor/farmer.template';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceUserTypeEnum } from 'src/modules/invoices/invoices.interface';
import { invoicesTemplate } from 'src/modules/invoices/templates/invoices.template';
import { getBeginningOfDayFromDate, getFullDateRange } from 'src/shared/functions/date-time.functions';
import { totalForAllInvoices, totalForSingleInvoice } from 'src/shared/functions/invoices.functions';
import { createNotification } from 'src/shared/functions/notifications.functions';
import { MemberAccountInterface, MemberInterface, MemberStatusEnum } from 'src/shared/interfaces/members.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { UserRegistrationInterface, UserInterface } from 'src/shared/interfaces/user.interface';
import { getTotalForField, sortArrayByKey, resolveMultiplePromises, generateUniqueId, FieldValueInterface, getItemsWithinDateRange, dayMonthYear } from 'victor-dev-toolbox';
import { MemberEventsEnum } from '../members-automation/members-events.enum';
import { SMSEventsEnum, SMSInterface } from 'src/shared/interfaces/sms.interface';
import { TenantInterface } from 'src/modules/tenants/interfaces/tenants.interface';
import { DefaultAccountEnums } from 'src/modules/accounting/accounting.interface';
import { InvoiceManagerService } from 'src/modules/invoices/services/invoice-manager/invoice-manager.service';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { convertMemberToUser } from 'src/shared/functions/members.functions';

const collection = DatabaseCollectionEnums.INVOICES;


@Injectable()
export class MembersService extends BaseService<any, any, any, any> {

    constructor(
        private emailService: EmailsService,
        private pdfService: PdfService,
        private invoiceManagerService: InvoiceManagerService,
        private usersService: UsersService,

    ) {
        super();
    }

    override async getAll(organizationId:
        string): Promise<any[]> {
        // return this.getCreditorsAndInvoices(organizationId);
        const members = await super.getAll(organizationId);
        return this.getMemberPayments({ organizationId, members });
    }

    override async getById(request: DBRequestInterface): Promise<any> {
        const { organizationId, id } = request;
        const Member: MemberInterface = await super.getById(request);
        if (!Member) return null;
        const members = await this.getMemberPayments({ organizationId, members: [Member] });
        return members[0] || null;
    }





    override async getByField(request: FieldValueRequestInterface): Promise<any[]> {

        const members: MemberInterface[] = await super.getByField(request);

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                ]
            }
        };
        return this.getMemberPayments({ organizationId: request.organizationId, members });
    }


    async getAllPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload, id } = request;
        // const {id:payload}

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$sellerId", organizationId] },
                    // { $eq: ["$buyerId", id] }
                ]
            }
        };
        const invoices = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.INVOICES, query, organizationId });
        return sortArrayByKey('createdAt', 'ASC', invoices);
    }

    async getCreditorsAndInvoices(organizationId: string) {
        const Members: MemberInterface[] = [];
        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    // { $eq: ["$sellerId", organizationId] }
                ]
            }
        };
        const promises: any[] = [
            super.getAll(organizationId),
            this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.INVOICES, query, organizationId }),
            this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS, organizationId }),
        ];
        const resolved = await resolveMultiplePromises(promises);

        const allCreditors: MemberInterface[] = resolved[0];
        const invoices: InvoiceInterface[] = resolved[1];
        const accounts: MemberAccountInterface[] = resolved[2];

        allCreditors.forEach(c => {
            const filteredInvoices = invoices.filter(i => i.buyerId === c.id);

            const totalAmount = getTotalForField(filteredInvoices, 'totalAmount');
            const totalPaid = Math.abs(getTotalForField(filteredInvoices, 'amountPaid'));
            const balance = totalAmount - totalPaid;

            const account = accounts.find(a => a.id === c.id);

            c.savings = account?.amount || 0;
            c.outstandingBalance = balance;
            Members.push(c);
        })
        return sortArrayByKey('balance', 'DESC', Members);
    }

    // Add Creditor
    override async create(data: CreateRequestInterface) {
        const { payload, organizationId } = data;
        const outstandingBalance = payload.outstandingBalance || 0;
        const savings = payload.savings || 0;
        delete payload.overpayment;
        delete payload.outstandingBalance;
        const user: UserInterface = convertMemberToUser({ organizationId, member: payload });
        const member = await this.usersService.registerUser({ id: user.id, organizationId, user, permissions: [] });

        if (outstandingBalance) {
            this.saveOutstandingBalance({ organizationId, member, amount: outstandingBalance });
        }

        if (savings) {
            this.saveOverpayment({ member, organizationId, amount: savings });
        }
        const notification = createNotification('success', 'Member created successfully');
        member.notification = notification;
        this.eventEmitter.emit(MemberEventsEnum.MEMBER_CREATED, { member, organizationId })
    }


    // override async create(data: CreateRequestInterface) {

    //     const { payload, organizationId } = data;
    //     return new Promise<any>(async (resolve, reject) => {
    //         const existingMembers: MemberInterface[] = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.MEMBERS, organizationId });



    //         const CreditorsWithSimilarName = await this.getByField(
    //             // { field: 'userId', value: Creditor.userId, organizationId, },
    //             {
    //                 payload: {
    //                     field: 'phone',
    //                     value: payload.phone,
    //                 },

    //                 organizationId,
    //             }

    //         );
    //         if (CreditorsWithSimilarName.length) {
    //             const notification = createNotification(
    //                 'error',
    //                 `The User is already a Member`,
    //             );
    //             resolve({ notification });
    //             return;
    //         }
    //         const id = payload.id || generateUniqueId();
    //         // payload.status = MemberStatusEnum.INACTIVE;
    //         payload.status =x

    //         const outstandingBalance = payload.outstandingBalance || 0;
    //         const overpayment = payload.overpayment || 0;
    //         delete payload.overpayment;
    //         delete payload.outstandingBalance;

    //         const member = await super.create({ id, payload, organizationId });
    //         if (outstandingBalance) {
    //             this.saveOutstandingBalance({ organizationId, member, amount: outstandingBalance });
    //         }

    //         if (overpayment) {
    //             this.saveOverpayment({ member, organizationId, amount: overpayment });
    //         }
    //         const notification = createNotification('success', 'Member created successfully');
    //         member.notification = notification;
    //         this.eventEmitter.emit(MemberEventsEnum.MEMBER_CREATED, { member, organizationId })

    //         resolve(member);

    //     });
    // }

    async getUserByFields(organizationId: string, fields: FieldValueInterface[]): Promise<UserInterface | null> {
        const query: MultipleFieldRequestInterface = {
            payload: {
                fields,
                queryType: 'matchOne',
            },
            collection: DatabaseCollectionEnums.USERS,
            organizationId
        }
        const user: UserInterface[] = await this.databaseService.getByMultipleFields(query);
        return user[0] || null;
    }


    async saveUser(user: UserRegistrationInterface, organizationId: string): Promise<UserInterface> {
        const { phone, email, idNumber, name } = user;
        const id = generateUniqueId();
        const itemDto: UserInterface = {
            id,
            name,
            email,
            username: email,
            phone,
            idNumber,
            photoURL: '',
            deleted: false,
            organizations: [organizationId],
            creditor: true,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString(),
        };
        const save = await this.databaseService.createItem({ id, itemDto, organizationId, collection: DatabaseCollectionEnums.USERS });
        return save;
    }


    async getUserDetails(organizationId: string, payload: { email: string }) {
        const collection = DatabaseCollectionEnums.USERS;
        const users = await this.databaseService.getItemsByField({ field: 'email', value: payload.email, collection, organizationId });
        const user = users[0] || null;
        return user;
    }

    private async getCreditorsReportHtml(organizationId: string) {
        const title = 'Members Report';
        const items: MemberInterface[] = await this.getAll(organizationId);
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const html = farmerDocumentTemplate({ title, items, organization });
        return html;
    }

    async downloadAsPDF(request: DBRequestInterface) {
        const { organizationId } = request;
        const fileName = `Members Report`;
        const htmlTemplate = await this.getCreditorsReportHtml(organizationId);
        const response = await this.pdfService.generatePDFFromHTML({ fileName, html: htmlTemplate });
        return response;
    }

    async sendToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { emails } = payload;
        const organization = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!organization) {
            throw new Error("Organization not found");
        }
        // const htmlTemplate = DocumentTemplate(Data);
        const fileName = `Members Report`;
        const pdf = await this.downloadAsPDF(request);
        const email: EmailInterface = {
            subject: fileName,
            html: fileName,
            recipients: emails,
            attachments: [{
                filename: fileName + `.pdf`,
                content: pdf.pdfBuffer,
                contentType: 'application/pdf'
            }]
        }
        const sendEmail = this.emailService.sendEmail(email);
        return true;
    }

    async print(request: DBRequestInterface) {
        const htmlTemplate = this.getCreditorsReportHtml(request.organizationId);
        return htmlTemplate;
    }



    async getSingleMemberInvoicesByDateRange(request: DBRequestInterface) {
        const { organizationId, payload, id } = request;
        const { startDate, stopDate, field } = payload;



        const invoices = await this.databaseService.getItemsByField({ organizationId, field, value: id, collection });
        const filtered = await getItemsWithinDateRange({ dateRange: { startDate, stopDate }, items: invoices, fieldToCheck: 'createdAt' });

        return sortArrayByKey('createdAt', 'DESC', filtered);
    }

    async getAllPendingSingleMemberInvoices(request: DBRequestInterface): Promise<InvoiceInterface[]> {
        const { organizationId, id } = request;
        // const { startDate, stopDate, field } = payload;

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$buyerId", id] },
                    // { $eq: ["$buyerId", id] }
                ]
            }
        };

        const invoices = await this.databaseService.getAllItems({ organizationId, query, collection });
        return invoices;

    }

    private async getSingleMemberInvoiceHTML(request: DBRequestInterface): Promise<string> {
        const { organizationId, payload, id } = request;



        const { startDate, stopDate } = payload;
        // if (field === 'buyerId') {
        //     collection = DatabaseCollectionEnums.DEBTORS;
        //     invoiceType = 'Debtor';
        // }
        const resolved = await resolveMultiplePromises([
            this.getSingleMemberInvoicesByDateRange(request),
            this.getByField({ organizationId, payload: { field: 'id', value: id, } }),
            this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
        ]);

        const invoices: InvoiceInterface[] = resolved[0];
        const users = resolved[1];
        const user = users[0] || null;
        const organization = resolved[2];
        const html = invoicesTemplate({ invoices, organization, user, dateRange: { startDate, stopDate }, invoiceType: 'Member' });
        return html;
    }

    async downloadSingleMemberInvoice(request: DBRequestInterface) {
        const { startDate, stopDate } = request.payload;
        const fileName = `Invoices-from-${startDate}-to-${stopDate}`;
        const html = await this.getSingleMemberInvoiceHTML(request);
        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName });
        return pdf;
    }


    async sendSingleMemberInvoiceToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate, emails } = payload;

        // const { emails } = payload;
        if (!emails || emails.length === 0) {
            // throw new Error("No emails provided");
            return false;
        }
        const html = await this.getSingleMemberInvoiceHTML(request);

        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName: `Invoices-from-${startDate}-to-${stopDate}` });


        const email: EmailInterface = {
            subject: `Invoices, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            html: `Invoices, ${dayMonthYear(startDate)} to ${dayMonthYear(stopDate)}`,
            recipients: emails,
            attachments: [{
                filename: `Invoices-from-${startDate}-to-${stopDate}.pdf`,
                content: pdf.pdfBuffer,
                contentType: 'application/pdf'
            }]
        }
        const send = this.emailService.sendEmail(email);

        return true;

    }


    async printSingleMemberInvoice(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const html = await this.getSingleMemberInvoiceHTML(request);
        return html;

    }

    async getMemberPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const fullRange = getFullDateRange(payload);
        const { startDate, stopDate } = fullRange;


        const query = {

            $expr: {
                $and: [
                    { $ne: ["$totalAmount", "$amountPaid"] }, // Ensures values are not equal
                    { $gte: ["$createdAt", startDate] },
                    { $lte: ["$createdAt", stopDate] },
                    { $eq: ["$userType", InvoiceUserTypeEnum.MEMBER] },
                ],
            }
        };

        const invoices = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });

        return invoices;
    }

    // async emitEvent() {
    //     this.eventEmitter.emit(SMSEventsEnum.SED_TEST_SMS);
    //     return "EVENT";
    // }


    // Save Over payments
    private async saveOverpayment(request: { organizationId: string, member: MemberInterface, amount: number }) {
        const { organizationId, member, amount } = request;
        const memberAccount = await this.getMemberAccount({ organizationId, id: member.id });

        const newAmount = memberAccount.amount + amount;

        return this.databaseService.updateItem({ id: member.id, itemDto: { amount: newAmount }, collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS, organizationId })
    }

    // Save Outstanding balances
    private async saveOutstandingBalance(request: { organizationId: string, member: MemberInterface, amount: number }) {
        const { organizationId, member, amount } = request;
        const id = generateUniqueId();
        const organization: TenantInterface = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const invoice: InvoiceInterface = {
            id,
            name: member.name,
            description: `Unpaid arrears before getting registered into the system`,
            invoiceType: InvoiceEnums.SUBSCRIPTION,
            items: [
                {
                    id: generateUniqueId(),
                    name: `Unpaid arrears before getting registered into the system`,
                    quantity: 1,
                    unitPrice: amount,
                    total: amount,
                    day: getBeginningOfDayFromDate(),

                    invoiceId: id,
                }
            ],
            totalAmount: amount,
            amountPaid: 0,
            currency: "KES",
            buyerId: member.id,
            sellerId: organizationId,
            accountId: DefaultAccountEnums.MEMBERSHIP_FEES,
            day: getBeginningOfDayFromDate(),
            category: InvoiceCategoryEnum.SALE,
            buyerName: member.name,
            sellerName: organization?.shortName || 'N/A',
            userType: InvoiceUserTypeEnum.MEMBER,
            buyerPhone: member.phone,
            sellerPhone: organization.phone,
            email: member.email,
            createdBy: 'SYSTEM'
        }

        const save = await this.databaseService.createItem({ id, itemDto: invoice, collection: DatabaseCollectionEnums.INVOICES, organizationId });
        return save;

    }

    private async getMemberAccount(request: { organizationId: string, id: string }): Promise<MemberAccountInterface> {
        const collection = DatabaseCollectionEnums.MEMBER_ACCOUNTS;
        const { organizationId, id } = request;
        const account = await this.databaseService.getItem({ organizationId, id, collection });
        if (account) return account;
        const createAccount = await this.databaseService.createItem({ id, organizationId, itemDto: { id, amount: 0 }, collection });
        return createAccount;
    }

    async resolveInvoicePayments(request: { id: string, organizationId: string }) {
        const { id, organizationId } = request;
        const account = await this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS });
        const currentAmount = account?.amount;
        if (!currentAmount) return;

        const invoices = await this.getAllPendingSingleMemberInvoices({ id, organizationId });
        if (!invoices.length) return null;
        const invoice = invoices[0];
        let current = currentAmount;
        let totalDeducted = 0; // Track the total deducted amount
        const promises: any[] = [];

        invoices.forEach(i => {
            if (!current) return;
            const pendingAmount = i.totalAmount - i.amountPaid;
            let amountPaid = pendingAmount;

            if (current >= pendingAmount) {
                current -= pendingAmount;
            } else {
                amountPaid = current;
                current = 0;
            }

            totalDeducted += amountPaid; // Accumulate the deducted amount
            promises.push(this.invoiceManagerService.payForInvoice({ organizationId, payload: { amountPaid } }));
        });

        const resolved = await resolveMultiplePromises(promises);

        // Notify the member about the deducted amount
        const sms: SMSInterface = {
            organizationId,
            message: `Hello ${invoice.buyerName}, KES ${totalDeducted} has been deducted from your account to pay for membership subscriptions.`,
            phone: invoice.buyerPhone,
        }
        this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, sms);

    }

    private async getMemberPayments(payload: { organizationId: string, members: MemberInterface[] }): Promise<MemberInterface[]> {
        const { organizationId, members } = payload;
        const memberAccounts: MemberAccountInterface[] = [];
        const allMembers: MemberInterface[] = [];
        let invoices: InvoiceInterface[] = [];
        if (!members.length) return allMembers;
        if (members.length === 1) {

            const member = members[0];
            if (!member.member) return allMembers
            invoices = await this.getAllPendingSingleMemberInvoices({ id: member.id, organizationId });
            const memberAccount: MemberAccountInterface = await this.getMemberAccount({ organizationId, id: member.id });
            const totals = totalForAllInvoices(invoices);
            member.outstandingBalance = totals.totalDue;
            member.savings = memberAccount.amount;
            allMembers.push(member);
        } else {
            invoices = await this.getAllPendingInvoices({ organizationId });
            const memberAccounts: MemberAccountInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS });
            members.forEach(m => {
                if (!m.member) return;
                const memberAccount = memberAccounts.find(ma => ma.id === m.id);
                const memberInvoices = invoices.filter(i => i.buyerId === m.id);
                const totals = totalForAllInvoices(memberInvoices);
                m.outstandingBalance = totals.totalDue;
                m.savings = memberAccount?.amount || 0;
                allMembers.push(m);
            })

        }
        // const invoices = await this.getAllPendingInvoices({ organizationId });
        return allMembers;
    }

    // await this.notifyMember({ organizationId, id, amountDeducted: totalDeducted });
}






