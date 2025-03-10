/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { DatabaseCollectionEnums, DBRequestInterface, CreateRequestInterface, checkIfExistsInterface, MultipleFieldRequestInterface, FieldValueRequestInterface } from 'src/database/database.interface';
import { EmailInterface } from 'src/INTEGRATIONS/emails/emails.interface';
import { EmailsService } from 'src/INTEGRATIONS/emails/services/emails/emails.service';
import { PdfService } from 'src/INTEGRATIONS/file-manager/services/pdf/pdf.service';
import { BaseService } from 'src/modules/base/base.service';
import { farmerDocumentTemplate } from 'src/modules/farmers/templates/creditor-debtor/farmer.template';
import { InvoiceInterface, InvoiceUserTypeEnum, InvoiceCategoryEnum, InvoiceEnums } from 'src/modules/invoices/invoices.interface';
import { invoicesTemplate } from 'src/modules/invoices/templates/invoices.template';
import { PurchaseEventEnums } from 'src/modules/mt-purchases/services/purchases-automation/putchase-events.enum';
import { getBeginningOfDayFromDate, getEndOfDayFromDate, getFullDateRange } from 'src/shared/functions/date-time.functions';
import { getDescriptionForInvoice, totalForAllInvoices } from 'src/shared/functions/invoices.functions';
import { createNotification } from 'src/shared/functions/notifications.functions';
import { MemberInterface, MembersDashboardInterface, MemberStatusEnum } from 'src/shared/interfaces/members.interface';
import { MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { UserRegistrationInterface, UserInterface } from 'src/shared/interfaces/user.interface';
import { getTotalForField, sortArrayByKey, resolveMultiplePromises, generateUniqueId, FieldValueInterface, getItemsWithinDateRange, dayMonthYear } from 'victor-dev-toolbox';

const collection = DatabaseCollectionEnums.INVOICES;


@Injectable()
export class MembersService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.MEMBERS;

    constructor(
        private emailService: EmailsService,
        private pdfService: PdfService,
    ) {
        super();
    }

    override async getAll(organizationId:
        string): Promise<any[]> {
        return this.getCreditorsAndInvoices(organizationId);
    }

    override async getById(request: DBRequestInterface): Promise<any> {
        const Member: MemberInterface = await super.getById(request);
        if (!Member) return null;
        const invoices = await this.getAllPendingInvoices(request);
        const totalAmount = getTotalForField(invoices, 'totalAmount');
        const amountPaid = getTotalForField(invoices, 'amountPaid');
        const balance = totalAmount - amountPaid;
        Member.balance = balance;
        return Member;
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
        const invoices = await this.databaseService.getAllItems({ organizationId: request.organizationId, collection: DatabaseCollectionEnums.INVOICES, query })

        const finalMembers: MemberInterface[] = [];
        members.forEach(m => {
            const filtered = invoices.filter(i => i.sellerId === m.id);
            const total = totalForAllInvoices(filtered);
            m.balance = total.totalDue;
            finalMembers.push(m);
        });
        return finalMembers;


    }


    async getAllPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload, id } = request;
        // const {id:payload}

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$buyerId", organizationId] },
                    { $eq: ["$sellerId", id] }
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
                    { $eq: ["$buyerId", organizationId] }
                ]
            }
        };
        const promises: any[] = [
            super.getAll(organizationId),
            this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.INVOICES, query, organizationId })
        ];
        const resolved = await resolveMultiplePromises(promises);

        const allCreditors = resolved[0];
        const invoices: InvoiceInterface[] = resolved[1];
        allCreditors.forEach(c => {
            const filteredInvoices = invoices.filter(i => i.sellerId === c.id);
            const totalAmount = getTotalForField(filteredInvoices, 'totalAmount');
            const totalPaid = Math.abs(getTotalForField(filteredInvoices, 'amountPaid'));
            const balance = totalAmount - totalPaid;
            c.balance = balance;
            Members.push(c);
        })
        return sortArrayByKey('balance', 'DESC', Members);
    }

    // Add Creditor
    async create(data: CreateRequestInterface) {

        const { payload, organizationId } = data;
        return new Promise<any>(async (resolve, reject) => {
            const CreditorsWithSimilarName = await this.getByField(
                // { field: 'userId', value: Creditor.userId, organizationId, },
                {
                    payload: {
                        field: 'phone',
                        value: payload.phone,
                    },

                    organizationId,
                }

            );
            if (CreditorsWithSimilarName.length) {
                const notification = createNotification(
                    'error',
                    `The User is already a Member`,
                );
                resolve({ notification });
                return;
            }
            const id = payload.id || generateUniqueId();
            super.create({ id, payload, organizationId })
                .then((res) => {
                    const notification = createNotification(
                        'success',
                        'Member Added Successfully',
                    );
                    res.notification = notification;
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }




    async addCreditor(data: DBRequestInterface) {
        const { id, payload, organizationId } = data;
        const user = payload as UserRegistrationInterface;
        const request: checkIfExistsInterface = {
            fields: [
                {
                    field: 'email',
                    value: user.email,
                },
                {
                    field: 'phone',
                    value: user.phone,
                },

            ],
            organizationId,
            collection: DatabaseCollectionEnums.USERS,
        }

        const fields = [
            {
                field: 'email',
                value: user.email,
            },
            {
                field: 'phone',
                value: user.phone,
            },
        ]
        const userInDB = await this.getUserByFields(organizationId, fields);


        // const userExists = await this.databaseService.checkIfExists(request);
        request.collection = DatabaseCollectionEnums.MEMBERS;
        const creditorExists = await this.databaseService.checkIfExists(request);
        if (creditorExists) {
            return {
                message: 'Member EXISTS',
            }
        }

        // Save as a Creditor
        const saveCreditor = await this.saveCreditor(user, organizationId, userInDB);
        return saveCreditor;

    }

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

    private async saveCreditor(user: UserRegistrationInterface, organizationId: string, userInDB: UserInterface | null) {

        let userId = generateUniqueId();
        if (!userInDB) {
            const dbUser: UserInterface = await this.saveUser(user, organizationId);
            userId = dbUser.id;
        } else {
            userId = userInDB.id;
        }
        const { phone, email, idNumber, name } = user;
        const itemDto: MemberInterface = {
            id: userId,
            userId,
            name,
            email,
            phone,
            idNumber,
            balance: 0,
            // paymentInterval: PaymentIntervalEnum.MONTHLY,
            currency: 'KES',
            deductions: [],
            allowances: [],
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString(),
            accountNumber: 0,
            status: MemberStatusEnum.ACTIVE,
        }
        const save = await this.databaseService.createItem({ id: itemDto.id, itemDto, organizationId, collection: DatabaseCollectionEnums.MEMBERS });
        return save;
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


    private getAllCreditorDetails(Creditor: MemberInterface | null, organizationId: string) {
        return new Promise<MemberInterface | null>((resolve, reject) => {
            if (!Creditor.userId) {
                resolve(Creditor);
                return;
            }
            this.databaseService.getItem({ id: Creditor.userId, collection: DatabaseCollectionEnums.USERS, organizationId }).then(res => {
                if (!res) {
                    resolve(Creditor);
                    return;
                }
                const clonedCreditor: MemberInterface = cloneDeep(Creditor);
                clonedCreditor.email = res.email;
                clonedCreditor.name = res.name;
                clonedCreditor.phone = res.phone;

                resolve(clonedCreditor);
            })

        })

    }

    // private getDetailsForMultipleCreditors(Creditors: MemberInterface[], organizationId: string) {
    //     return new Promise<MemberInterface[]>((resolve, reject) => {
    //         const modifiedCreditors: MemberInterface[] = [];
    //         this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.USERS, organizationId }).then((users: UserInterface[]) => {
    //             Creditors.forEach(e => {
    //                 const user = users.find(u => u.id === e.userId);
    //                 if (!user) {
    //                     modifiedCreditors.push(e);
    //                 } else {
    //                     const clonedCreditor = cloneDeep(e);
    //                     clonedCreditor.email = user.email;
    //                     clonedCreditor.name = user.name;
    //                     clonedCreditor.phone = user.phone.toString();
    //                     modifiedCreditors.push(clonedCreditor);
    //                 }
    //                 resolve(modifiedCreditors);
    //             })
    //         });

    //     })
    // }

    async getUserDetails(organizationId: string, payload: { email: string }) {
        const collection = DatabaseCollectionEnums.USERS;
        const users = await this.databaseService.getItemsByField({ field: 'email', value: payload.email, collection, organizationId });
        const user = users[0] || null;
        return user;
    }

    async addCreditorByPhone(data: CreateRequestInterface) {
        const { organizationId, payload, id } = data;
        const { phone } = payload;
        const users: UserInterface[] = await this.databaseService.getItemsByField({ field: 'phone', value: phone, collection: DatabaseCollectionEnums.USERS, organizationId });
        const user = users[0];
        if (!user) {
            return false;
        }

        const creditor: MemberInterface = {
            id,
            userId: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            idNumber: user.idNumber,
            createdBy: 'SYSTEM',
            balance: 0,
            // paymentInterval: PaymentIntervalEnum.MONTHLY,
            currency: 'KES',
            createdAt: new Date().toISOString(),
            accountNumber: 0,
            status: MemberStatusEnum.ACTIVE
        };
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

        const query = {
            // where field = field, value = id
            // where date >= startdate <= stopDate
        }

        const invoices = await this.databaseService.getItemsByField({ organizationId, field, value: id, collection });
        const filtered = await getItemsWithinDateRange({ dateRange: { startDate, stopDate }, items: invoices, fieldToCheck: 'createdAt' });

        return sortArrayByKey('createdAt', 'DESC', filtered);
    }

    private async getSingleMemberInvoiceHTML(request: DBRequestInterface): Promise<string> {
        const { organizationId, payload, id } = request;



        const { startDate, stopDate } = payload;
        const collection = DatabaseCollectionEnums.MEMBERS;
        // if (field === 'buyerId') {
        //     collection = DatabaseCollectionEnums.DEBTORS;
        //     invoiceType = 'Debtor';
        // }
        const resolved = await resolveMultiplePromises([
            this.getSingleMemberInvoicesByDateRange(request),
            this.databaseService.getItemsByField({ organizationId, field: 'id', value: id, collection }),
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

    async purchase(data: DBRequestInterface) {
        const { organizationId, payload } = data;
        const { sale, products } = payload;
        const item = sale as MT_SaleInterface;
        item.items = products;
        item.category = InvoiceCategoryEnum.PURCHASE
        item.invoiceType = InvoiceEnums.PURCHASE,
            item.buyerId = organizationId;
        // item.sellerId
        // const seller: MemberInterface = await this.databaseService.getItem({ id: item.sellerId || 'none', organizationId, collection: DatabaseCollectionEnums.MEMBERS });
        const seller: MemberInterface = await this.getById({ id: item.sellerId || 'none', organizationId });
        if (seller) {
            item.sellerId = seller.id;
            item.sellerName = seller.name;
            item.email = seller.email;
            item.sellerPhone = seller.phone;
        }



        const id = item.id || generateUniqueId();
        item.id = id;

        const invoice = await this.addMemberDetails(organizationId, item);
        const description = getDescriptionForInvoice(invoice);
        invoice.description = description;
        invoice.userType = InvoiceUserTypeEnum.MEMBER;

        const saveSale = await this.databaseService.createItem({ id, organizationId, itemDto: invoice, collection });

        const record: MT_SaleRecordInterface = {

            saleId: saveSale.id,
            id: generateUniqueId(),
            items: products,
            createdBy: "SYSTEM"
        };

        this.eventEmitter.emit(PurchaseEventEnums.PURCHASE_MADE, { record, organizationId, sale: saveSale });
        return saveSale;

    }

    private async addMemberDetails(organizationId: string, invoice: InvoiceInterface): Promise<InvoiceInterface> {
        const Member: MemberInterface = await this.getById({ id: invoice.sellerId || 'none', organizationId });
        if (Member) {
            invoice.sellerId = Member.id;
            invoice.sellerName = Member.name;
            invoice.email = Member.email;
            invoice.sellerPhone = Member.phone;
        }
        return invoice;
    }


    async getMemberPendingInvoices(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const fullRange = getFullDateRange(payload);
        const { startDate, stopDate } = fullRange;

        // const query = {
        //     $expr: {
        //         $and: [
        //             { $gt: ["$totalAmount", "$amountPaid"] },
        //             { $gt: ["$amountPaid", "$totalAmount"] },
        //             { $gte: ["$day", startDate] },
        //             { $lte: ["$day", stopDate] },
        //         ],
        //     }
        // };

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

}


