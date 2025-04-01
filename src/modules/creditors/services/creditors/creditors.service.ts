import { cloneDeep } from 'lodash';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createNotification } from 'src/shared/functions/notifications.functions';
import { CreditorInterface } from 'src/shared/interfaces/creditors.interface';
import { UserInterface, UserRegistrationInterface } from 'src/shared/interfaces/user.interface';
import { checkIfExistsInterface, CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface, FieldValueInterface, MultipleFieldQueryInterface, MultipleFieldRequestInterface, MultipleFieldValueInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { generateUniqueId } from 'src/database/database.functions';
import { prepareRequest } from 'src/modules/base/controllers/base/base.controller';
import { filterByDateRange, getTotalForField, sortArrayByKey } from 'victor-dev-toolbox';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { InvoiceInterface } from 'src/modules/invoices/invoices.interface';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { creditorDocumentTemplate } from 'src/modules/accounting/templates/creditor-debtor/creditor.template';
import { PaymentIntervalEnum } from 'src/shared/interfaces/payment.interface';

@Injectable()
export class CreditorsService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.CREDITORS;

    constructor(
        private emailService: EmailsService,
        private pdfService: PdfService,
    ) {
        super();
    }

    override async getAll(organizationId: string): Promise<any[]> {
        return this.getCreditorsAndInvoices(organizationId);
    }

    override async getById(request: DBRequestInterface): Promise<any> {
        const creditor: CreditorInterface = await super.getById(request);
        if (!creditor) return null;
        const invoices = await this.getAllPendingInvoices(request);
        const totalAmount = getTotalForField(invoices, 'totalAmount');
        const amountPaid = getTotalForField(invoices, 'amountPaid');
        const balance = totalAmount - amountPaid;
        creditor.balance = balance;
        return creditor;
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
        const creditors: CreditorInterface[] = [];
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
            creditors.push(c);
        })
        return sortArrayByKey('balance', 'DESC', creditors);
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
                    `The User is already a Creditor`,
                );
                resolve({ notification });
                return;
            }
            const id = payload.id || generateUniqueId();
            super.create({ id, payload, organizationId })
                .then((res) => {
                    const notification = createNotification(
                        'success',
                        'Creditor Added Successfully',
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
        request.collection = DatabaseCollectionEnums.CREDITORS;
        const creditorExists = await this.databaseService.checkIfExists(request);
        if (creditorExists) {
            return {
                message: 'CREDITOR EXISTS',
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
        const itemDto: CreditorInterface = {
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
        }
        const save = await this.databaseService.createItem({ id: itemDto.id, itemDto, organizationId, collection: DatabaseCollectionEnums.CREDITORS });
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


    private getAllCreditorDetails(Creditor: CreditorInterface | null, organizationId: string) {
        return new Promise<CreditorInterface | null>((resolve, reject) => {
            if (!Creditor.userId) {
                resolve(Creditor);
                return;
            }
            this.databaseService.getItem({ id: Creditor.userId, collection: DatabaseCollectionEnums.USERS, organizationId }).then(res => {
                if (!res) {
                    resolve(Creditor);
                    return;
                }
                const clonedCreditor: CreditorInterface = cloneDeep(Creditor);
                clonedCreditor.email = res.email;
                clonedCreditor.name = res.name;
                clonedCreditor.phone = res.phone;

                resolve(clonedCreditor);
            })

        })

    }

    private getDetailsForMultipleCreditors(Creditors: CreditorInterface[], organizationId: string) {
        return new Promise<CreditorInterface[]>((resolve, reject) => {
            const modifiedCreditors: CreditorInterface[] = [];
            this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.USERS, organizationId }).then((users: UserInterface[]) => {
                Creditors.forEach(e => {
                    const user = users.find(u => u.id === e.userId);
                    if (!user) {
                        modifiedCreditors.push(e);
                    } else {
                        const clonedCreditor = cloneDeep(e);
                        clonedCreditor.email = user.email;
                        clonedCreditor.name = user.name;
                        clonedCreditor.phone = user.phone.toString();
                        modifiedCreditors.push(clonedCreditor);
                    }
                    resolve(modifiedCreditors);
                })
            });

        })
    }

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

        const creditor: CreditorInterface = {
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
        };
    }

    private async getCreditorsReportHtml(organizationId: string) {
        const title = 'Creditors Report';
        const items: CreditorInterface[] = await this.getAll(organizationId);
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const html = creditorDocumentTemplate({ title, items, organization });
        return html;
    }

    async downloadAsPDF(request: DBRequestInterface) {
        const { organizationId } = request;
        const fileName = `Creditors Report`;
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
        const fileName = `Creditors Report`;
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

}


