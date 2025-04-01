/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { checkIfExistsInterface, CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface, FieldValueInterface, MultipleFieldRequestInterface } from 'src/database/database.interface';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceUserTypeEnum } from 'src/modules/invoices/invoices.interface';
import { invoicesTemplate } from 'src/modules/invoices/templates/invoices.template';
import { createNotification } from 'src/shared/functions/notifications.functions';
import { FarmerInterface, FarmersDashboardInterface } from 'src/shared/interfaces/farmer.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { PaymentIntervalEnum } from 'src/shared/interfaces/payment.interface';
import { UserRegistrationInterface, UserInterface } from 'src/shared/interfaces/user.interface';
import { getTotalForField, sortArrayByKey, resolveMultiplePromises, generateUniqueId, getItemsWithinDateRange, dayMonthYear } from 'victor-dev-toolbox';
import { farmerDocumentTemplate } from '../../templates/creditor-debtor/farmer.template';
import { MT_SaleInterface, MT_SaleRecordInterface } from 'src/shared/interfaces/MT-sales.interface';
import { PurchaseEventEnums } from 'src/modules/mt-purchases/services/purchases-automation/putchase-events.enum';
import { getDescriptionForInvoice } from 'src/shared/functions/invoices.functions';
import { getBeginningOfDayFromDate, getEndOfDayFromDate, getFullDateRange } from 'src/shared/functions/date-time.functions';
import { MemberStatusEnum } from 'src/shared/interfaces/members.interface';


const collection = DatabaseCollectionEnums.INVOICES;

@Injectable()
export class FarmersService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.FARMERS;

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
        const farmer: FarmerInterface = await super.getById(request);
        if (!farmer) return null;
        const invoices = await this.getAllPendingInvoices(request);
        const totalAmount = getTotalForField(invoices, 'totalAmount');
        const amountPaid = getTotalForField(invoices, 'amountPaid');
        const balance = totalAmount - amountPaid;
        farmer.balance = balance;
        return farmer;
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
        const farmers: FarmerInterface[] = [];
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
            farmers.push(c);
        })
        return sortArrayByKey('balance', 'DESC', farmers);
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
                    `The User is already a Farmer`,
                );
                resolve({ notification });
                return;
            }
            const id = payload.id || generateUniqueId();
            super.create({ id, payload, organizationId })
                .then((res) => {
                    const notification = createNotification(
                        'success',
                        'Farmer Added Successfully',
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
        request.collection = DatabaseCollectionEnums.FARMERS;
        const creditorExists = await this.databaseService.checkIfExists(request);
        if (creditorExists) {
            return {
                message: 'FARMER EXISTS',
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
        const itemDto: FarmerInterface = {
            id: userId,
            userId,
            name,
            email,
            phone,
            idNumber,
            balance: 0,
            paymentInterval: PaymentIntervalEnum.MONTHLY,
            currency: 'KES',
            deductions: [],
            allowances: [],
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString(),
            accountNumber: 0,
            status: MemberStatusEnum.ACTIVE,
        }
        const save = await this.databaseService.createItem({ id: itemDto.id, itemDto, organizationId, collection: DatabaseCollectionEnums.FARMERS });
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


    private getAllCreditorDetails(Creditor: FarmerInterface | null, organizationId: string) {
        return new Promise<FarmerInterface | null>((resolve, reject) => {
            if (!Creditor.userId) {
                resolve(Creditor);
                return;
            }
            this.databaseService.getItem({ id: Creditor.userId, collection: DatabaseCollectionEnums.USERS, organizationId }).then(res => {
                if (!res) {
                    resolve(Creditor);
                    return;
                }
                const clonedCreditor: FarmerInterface = cloneDeep(Creditor);
                clonedCreditor.email = res.email;
                clonedCreditor.name = res.name;
                clonedCreditor.phone = res.phone;

                resolve(clonedCreditor);
            })

        })

    }

    // private getDetailsForMultipleCreditors(Creditors: FarmerInterface[], organizationId: string) {
    //     return new Promise<FarmerInterface[]>((resolve, reject) => {
    //         const modifiedCreditors: FarmerInterface[] = [];
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

        const creditor: FarmerInterface = {
            id,
            userId: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            idNumber: user.idNumber,
            createdBy: 'SYSTEM',
            balance: 0,
            paymentInterval: PaymentIntervalEnum.MONTHLY,
            currency: 'KES',
            createdAt: new Date().toISOString(),
            accountNumber: 0,
            status: MemberStatusEnum.ACTIVE
        };
    }

    private async getCreditorsReportHtml(organizationId: string) {
        const title = 'Farmers Report';
        const items: FarmerInterface[] = await this.getAll(organizationId);
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        // const html = farmerDocumentTemplate({ title, items, organization });
        const html = "NOT SUPPORTED";
        return html;
    }

    async downloadAsPDF(request: DBRequestInterface) {
        const { organizationId } = request;
        const fileName = `Farmers Report`;
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
        const fileName = `Farmers Report`;
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


    async dashboard(request: DBRequestInterface): Promise<FarmersDashboardInterface> {
        const { organizationId } = request;
        const dashboardInvoices = await this.dashboardInvoices(request);
        const farmers = await this.getAll(organizationId);

        const { pendingInvoices, totalPendingAmount, totalSales, totalPurchases, totalLoans, saleInvoices, purchaseInvoices, highestSale, outStandingPayment, purchaseTransactions, saleTransactions } = dashboardInvoices;

        const dashboard: FarmersDashboardInterface = {
            totalSales,
            totalPurchases,
            totalLoans,
            saleInvoices,
            purchaseInvoices,
            highestSale,
            outStandingPayment,
            totalFarmers: farmers.length,
            salesBreakdown: null,
            pendingInvoices,
            totalPendingAmount,
            purchaseTransactions,
            saleTransactions,
        }
        return dashboard;
    }

    private async dashboardInvoices(request: DBRequestInterface) {
        const { organizationId } = request;
        const today = new Date().toISOString();
        const startDate = getBeginningOfDayFromDate(today);
        const stopDate = getEndOfDayFromDate(today);

        const query = {
            day: {
                $gte: startDate, // ISO string comparison
                $lte: stopDate,
            },
        };

        const todayInvoices: InvoiceInterface[] = await this.databaseService.getItemsByDateRange({ organizationId, collection: DatabaseCollectionEnums.INVOICES, startDate, stopDate });
        const invoices = todayInvoices.filter(i => i.userType === InvoiceUserTypeEnum.FARMER);
        // const invoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.INVOICES, query });

        const pendingInvoices = invoices.filter(i => i.totalAmount > i.amountPaid);

        const purchaseInvoices = invoices.filter(i => i.buyerId === organizationId);
        const saleInvoices = invoices.filter(i => i.sellerId === organizationId);
        const totalPurchases = getTotalForField(purchaseInvoices, 'totalAmount');
        const totalSales = getTotalForField(saleInvoices, 'totalAmount');
        const highestSale = sortArrayByKey('totalAmount', 'DESC', saleInvoices)[0] || 0;
        const totalPaidPurchases = getTotalForField(purchaseInvoices, 'amountPaid');

        return {
            pendingInvoices: pendingInvoices.length,
            totalPendingAmount: pendingInvoices.length,
            totalPurchases,

            totalSales,
            saleInvoices,
            purchaseInvoices,

            purchaseTransactions: purchaseInvoices.length,
            saleTransactions: saleInvoices.length,
            outStandingPayment: totalPurchases - totalPaidPurchases,

            highestSale,
            totalLoans: 0,

        }

    }

    // private salesBreakdown(invoices: InvoiceInterface[]) {
    //     const creditSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CREDIT_SALE);
    //     const cashSales = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.CASH_SALE);
    //     const purchases = invoices.filter(invoice => invoice.invoiceType === InvoiceEnums.PURCHASE);

    //     const pieChart: PieChartInterface = {
    //         labels: ['Cash Sales', 'Credit Sales', 'Purchases'],
    //         series: [getTotalForField(cashSales, 'totalAmount'), getTotalForField(creditSales, 'totalAmount'), getTotalForField(purchases, 'totalAmount')],
    //         // title: 'Credit And Cash Sales',
    //         // width?: number,
    //         // height?: number,
    //     }

    //     return pieChart;
    // }

    async getSingleFarmerInvoicesByDateRange(request: DBRequestInterface) {
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

    private async getSingleFarmerInvoiceHTML(request: DBRequestInterface): Promise<string> {
        const { organizationId, payload, id } = request;



        const { startDate, stopDate } = payload;
        const collection = DatabaseCollectionEnums.FARMERS;
        // if (field === 'buyerId') {
        //     collection = DatabaseCollectionEnums.DEBTORS;
        //     invoiceType = 'Debtor';
        // }
        const resolved = await resolveMultiplePromises([
            this.getSingleFarmerInvoicesByDateRange(request),
            this.databaseService.getItemsByField({ organizationId, field: 'id', value: id, collection }),
            this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS }),
        ]);

        const invoices: InvoiceInterface[] = resolved[0];
        const users = resolved[1];
        const user = users[0] || null;
        const organization = resolved[2];
        const html = invoicesTemplate({ invoices, organization, user, dateRange: { startDate, stopDate }, invoiceType: 'Farmer' });
        return html;
    }

    async downloadSingleFarmerInvoice(request: DBRequestInterface) {
        const { startDate, stopDate } = request.payload;
        const fileName = `Invoices-from-${startDate}-to-${stopDate}`;
        const html = await this.getSingleFarmerInvoiceHTML(request);
        const pdf = await this.pdfService.generatePDFFromHTML({ html, fileName });
        return pdf;
    }


    async sendSingleFarmerInvoiceToEmail(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate, emails } = payload;

        // const { emails } = payload;
        if (!emails || emails.length === 0) {
            // throw new Error("No emails provided");
            return false;
        }
        const html = await this.getSingleFarmerInvoiceHTML(request);

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


    async printSingleFarmerInvoice(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { startDate, stopDate } = payload;
        if (!startDate || !stopDate) {
            throw new Error('Start and stop dates are required');
        }
        const html = await this.getSingleFarmerInvoiceHTML(request);
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
        // const seller: FarmerInterface = await this.databaseService.getItem({ id: item.sellerId || 'none', organizationId, collection: DatabaseCollectionEnums.FARMERS });
        const seller: FarmerInterface = await this.getById({ id: item.sellerId || 'none', organizationId });
        if (seller) {
            item.sellerId = seller.id;
            item.sellerName = seller.name;
            item.email = seller.email;
            item.sellerPhone = seller.phone;
        }



        const id = item.id || generateUniqueId();
        item.id = id;

        const invoice = await this.addFarmerDetails(organizationId, item);
        const description = getDescriptionForInvoice(invoice);
        invoice.description = description;
        invoice.userType = InvoiceUserTypeEnum.FARMER;

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

    private async addFarmerDetails(organizationId: string, invoice: InvoiceInterface): Promise<InvoiceInterface> {
        const farmer: FarmerInterface = await this.getById({ id: invoice.sellerId || 'none', organizationId });
        if (farmer) {
            invoice.sellerId = farmer.id;
            invoice.sellerName = farmer.name;
            invoice.email = farmer.email;
            invoice.sellerPhone = farmer.phone;
        }
        return invoice;
    }


    async getFarmerPendingInvoices(request: DBRequestInterface) {
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
                    { $eq: ["$userType", InvoiceUserTypeEnum.FARMER] },
                ],
            }
        };

        const invoices = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });

        return invoices;
    }

}


