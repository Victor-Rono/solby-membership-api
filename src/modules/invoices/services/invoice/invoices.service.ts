/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface, DBStatusTypes, MultipleFieldQueryInterface, MultipleFieldRequestInterface } from 'src/database/database.interface';
import { resolveMultiplePromises, resolveMultiplePromisesInIntervals } from 'src/shared/functions/promises.functions';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { combineArrays, getEnumValues, getFieldValuesFromArray, getTotalForField, sortArrayByKey, uniqueArrayItems } from 'victor-dev-toolbox';
import { cloneDeep } from 'lodash';
import { generateUniqueId } from 'src/database/database.functions';
import { isToday, jumpToXNumberOfDays } from "victor-dev-toolbox"
import { BaseService } from 'src/modules/base/base.service';
import { SmsService } from 'src/modules/notifications/sms/services/sms/sms.service';
import { InvoiceInterface, PayForInvoicesInterface, InvoiceEnums, InvoiceRevenueInterface, InvoiceStatsInterface } from 'src/modules/invoices/invoices.interface';
import { ProdFrontendURL } from 'src/shared/data/application.data';
import { SMSEventsEnum } from 'src/shared/interfaces/sms.interface';

@Injectable()
export class InvoicesService extends BaseService<any, any, any, any> {
    constructor(
        private smsService: SmsService,
    ) {
        super();
    }



    async processInvoice(request: DBRequestInterface) {
        const { id, payload, organizationId } = request;
        const { amount, invoiceFromDB } = payload;
        const invoice: InvoiceInterface | null = invoiceFromDB || await this.getById({ id, organizationId });
        if (!invoice) {
            return false;
        }
        // const { totalAmount, amountPaid } = invoice;
        const { amountPaid } = invoice;
        const newAmountPaid = amountPaid + amount;
        const updateData: Partial<InvoiceInterface> = {
            amountPaid: newAmountPaid,
        };

        if (newAmountPaid >= invoice.totalAmount) {
            updateData.status = 'Paid';
        }


        const update = await this.update({ id, organizationId, payload: updateData });

        // const sendSMS = this.notifyBuyer({ organizationId, invoice, amount: amount.toString() });

        return update;
    }

    async saveInvoice(request: DBRequestInterface) {
        try {
            const { payload, organizationId } = request;
            const { invoice } = payload;
            const id = generateUniqueId();
            const invoiceToSave = payload as InvoiceInterface;

            // Assign a unique ID to the invoice
            invoiceToSave.id = id;

            // Save the invoice
            const save = await this.create({ payload: invoiceToSave, organizationId });

            // Notify the buyer
            const message = `You have a new invoice from ${invoiceToSave.sellerName || 'Maziwa tele'} for KES ${invoiceToSave.totalAmount}. Please Click on the link to see details: ${ProdFrontendURL}/invoices/view/${invoiceToSave.id}. Thank you.`;
            invoiceToSave.serialNumber = save.serialNumber;
            await this.notifyBuyer({ organizationId, invoice: invoiceToSave, amount: invoiceToSave.totalAmount.toString(), msg: message });

            return save;
        } catch (error) {
            console.error('Error saving invoice:', error);
            throw new Error('Failed to save invoice');
        }
    }


    async processMultipleInvoicesForUser(request: DBRequestInterface) {
        const { id, payload, organizationId } = request;
        const { amount, invoices } = payload;
        const allInvoices: string[] = invoices || [];



        const invoice: InvoiceInterface | null = await this.getById({ id, organizationId });
        if (!invoice) {
            return false;
        }
        const { totalAmount, amountPaid } = invoice;
        const newAmountPaid = amountPaid + amount;
        const updateData: Partial<InvoiceInterface> = {
            amountPaid: newAmountPaid,
        };
        const update = await this.update({ id, organizationId, payload: updateData });
        const sendSMS = await this.notifyBuyer({ organizationId, invoice, amount: amount.toString() });
        return update;

    }

    // async processMultipleInvoices(payload: { amount: number, organizationId: string, userId: string, invoiceType: InvoiceEnums, invoiceIds?: string[] }) {
    async processMultipleInvoices(request: DBRequestInterface) {
        const { id, payload, organizationId } = request;
        const { userId, invoiceType, invoiceIds, amount } = payload;
        const query: MultipleFieldRequestInterface = {
            payload: {
                fields: [
                    {
                        field: 'invoiceType',
                        value: invoiceType,
                    },
                    {
                        field: 'buyerId',
                        value: userId,
                    }
                ],
                queryType: 'matchAll',
            },
            organizationId,
            collection: this.collection,


        };
        const invoices = await this.databaseService.getByMultipleFields(query);

        let filtered = invoices.filter((invoice: InvoiceInterface) => { invoice.status === 'Pending' || !invoice.status });

        if (invoiceIds.length) {
            filtered = invoices.filter((invoice: InvoiceInterface) => invoiceIds.includes(invoice.id));
        }

        const sorted = sortArrayByKey('createdAt', 'DESC', filtered);
        const pay = await this.paymentForMultipleInvoices({ organizationId, invoices: sorted, amount });
    }


    async processAllInvoices(request: DBRequestInterface) {
        const { id, organizationId, payload, } = request;
        const { amount, invoiceIds, invoiceType } = payload;
        const invoices = await this.processInvoicesPromise({ organizationId, invoiceType });
        let filtered = cloneDeep(invoices);
        if (invoiceIds.length) {
            filtered = invoices.filter((invoice: InvoiceInterface) => invoiceIds.includes(invoice.id));
        }
        const paid = await this.payForInvoices({ organizationId, amount, invoices: filtered });

        const userIds = getFieldValuesFromArray('buyerId', filtered);
        const filteredUserIds = uniqueArrayItems(userIds);
        this.sendSMSToBuyers(organizationId, filteredUserIds);
        return paid;
    }

    async payForInvoices(payload: PayForInvoicesInterface) {
        const { invoices, amount, organizationId } = payload;
        const promises: any[] = [];
        let availableAmount = amount;

        for (const invoice of invoices) {
            if (availableAmount > 0) {
                const amountPaid = invoice?.amountPaid || 0;
                const remainingAmount = invoice.totalAmount - amountPaid; // Calculate remaining amount to be paid
                let amountToPay = remainingAmount;

                if (availableAmount < remainingAmount) {
                    amountToPay = availableAmount;
                }

                const newAmountPaid = amountPaid + amountToPay;
                const updatePayload: Partial<InvoiceInterface> = {
                    amountPaid: newAmountPaid,
                };

                if (newAmountPaid === invoice.totalAmount) {
                    updatePayload.status = 'Completed';
                }

                const update = this.update({
                    id: invoice.id,
                    organizationId,
                    payload: updatePayload,
                });

                promises.push(update);
                availableAmount -= amountToPay;
            }
        }

        const updates = await resolveMultiplePromises(promises);
        return updates;
    }


    async sendSMSToBuyers(organizationId: string, userIds: string[]) {
        const promises: any[] = [];
        const users: UserInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.USERS });
        const filteredUsers = users.filter((user: UserInterface) => userIds.includes(user.id));
        for (const user of filteredUsers) {
            const message = `Hello ${user.name}, Some of your invoices have been paid for. Login to maziwa Tele to view details. https://erp.maziwa.tele.com`;
            const sendSMS = await this.smsService.sendSMS({ organizationId, phone: user.phone, message, });
            promises.push(sendSMS);
        }
        return resolveMultiplePromises(promises);
    }

    private processInvoicesPromise(data: { organizationId: string, invoiceType?: InvoiceEnums }) {
        const { organizationId, invoiceType } = data;
        if (invoiceType) {
            return this.getByField({
                payload: {
                    field: 'invoiceType',
                    value: invoiceType,
                },
                organizationId,
            })
        } else {
            return this.getAll(organizationId);
        }
    }

    async paymentForMultipleInvoices(data: { organizationId: string, invoices: InvoiceInterface[], amount: number }) {
        const { invoices, amount, organizationId } = data;
        const promises: any[] = [];
        let availableAmount = amount;
        invoices.forEach(async (invoice) => {
            const i = cloneDeep(invoice);
            let amountToPay = 0;
            const balance = i.totalAmount - i.amountPaid;
            if (availableAmount >= balance) {
                // update invoice
                i.status = 'Completed';
                i.amountPaid = i.totalAmount;
                amountToPay = balance;
                // const update = await this.update({ id: i.id, organizationId, payload: i });
            } else {
                // update invoice
                i.status = 'Pending';
                i.amountPaid = i.amountPaid + availableAmount;
                amountToPay = availableAmount;
                // const update = await this.update({ id: i.id, organizationId, payload: i });
            }
            availableAmount = availableAmount - balance;
            const dbRequest: DBRequestInterface = {
                organizationId,
                payload: { amount: amountToPay },
                id: i.id,
            }

            promises.push(this.processInvoice(dbRequest));
        });
        const processPayments = await resolveMultiplePromisesInIntervals({ promises, interval: 12 });
        return true;
    }


    private async notifyUsers(invoice: InvoiceInterface, organizationId: string) {

        const promises = await resolveMultiplePromises([
            this.databaseService.getItem({ id: invoice.buyerId, organizationId, collection: DatabaseCollectionEnums.USERS }),
            this.databaseService.getItem({ id: invoice.sellerId, organizationId, collection: DatabaseCollectionEnums.USERS }),
        ]);
        const [buyer, seller] = promises;

    }

    private async notifyBuyer(payload: { organizationId: string, invoice: InvoiceInterface, amount: string, msg?: string }) {

        const { invoice, organizationId, amount, msg } = payload;
        const user: UserInterface = await this.databaseService.getItem({ id: invoice.buyerId, organizationId, collection: DatabaseCollectionEnums.USERS });
        const url = `${process.env.FRONTEND_URL}/invoice/view/${invoice.id}`;
        let message = msg || `Hello ${user.name}, ${invoice.currency} ${amount} has been received for your invoice ${invoice.serialNumber}. ${url}`;
        if (invoice.amountPaid >= invoice.totalAmount) {
            message = `Hello ${user.name}, your payment for invoice ${invoice.serialNumber} has been completed. ${url}`;
        }

        const sms = await this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, {
            organizationId,
            phone: user.phone,
            message,
        });
        return sms;
    }

    async getSalesDashboardContent(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { userId } = payload;
        const invoiceTypes: InvoiceEnums[] = getEnumValues(InvoiceEnums);

        const promises: any[] = [];
        // const invoices: InvoiceInterface[] = await this.getAll(organizationId);

        invoiceTypes.forEach(invoiceType => {
            const userId = payload?.userId || null;

        });
        const data = await resolveMultiplePromises(promises);
        const items = data.concat(data[0], data[1]);

        const preparedInvoices = await this.prepareAndCategorizeInvoices({
            organizationId,
            userId,
        });
        const todayInvoices = preparedInvoices.filter(i => isToday(i.createdAt));
        return todayInvoices;
    }

    async prepareAndCategorizeInvoices(payload: { organizationId: string, invoices?: InvoiceInterface[], invoiceType?: InvoiceEnums, status?: DBStatusTypes, userId?: string, today?: 'today' }) {
        const { invoices, status, organizationId, invoiceType, userId, today } = payload;

        const allInvoices = invoices || await this.getInvoicesPromise({ organizationId, userId, invoiceType });


        let clonedInvoices = cloneDeep(allInvoices);

        if (today) {
            clonedInvoices = clonedInvoices.filter(invoice => isToday(invoice.createdAt));
        }



        // if (userId) {
        //     return clonedInvoices;
        // }


        const buyerIds: string[] = getFieldValuesFromArray('buyerId', allInvoices, { unique: 'unique', onlyTrueValues: 'onlyTrueValues' });
        const sellerIds: string[] = getFieldValuesFromArray('sellerId', allInvoices, { unique: 'unique', onlyTrueValues: 'onlyTrueValues' });
        const combinedIds = uniqueArrayItems(buyerIds.concat(sellerIds));

        const userIds = await uniqueArrayItems(combinedIds);

        if (invoiceType) {
            clonedInvoices = clonedInvoices.filter(invoice => invoice.invoiceType === invoiceType);
        }

        if (status) {
            clonedInvoices = clonedInvoices.filter(invoice => invoice.status === status);
        }





        const preparedInvoices: InvoiceInterface[] = [];
        userIds.forEach(userId => {
            const userInvoices = clonedInvoices.filter(invoice => (invoice.buyerId === userId || invoice.sellerId === userId));

            if (userId === `a03dd706-9e88-4678-a888-a4ca18db98b3`) {

            }


            if (userInvoices.length > 0) {
                const filteredInvoices = sortArrayByKey('createdAt', 'DESC', userInvoices);
                const buyerInvoices = filteredInvoices.filter(invoice => invoice.buyerId === userId);

                const invoice: InvoiceInterface = buyerInvoices[0];
                if (invoice) {
                    const totalAmount = getTotalForField(filteredInvoices, 'totalAmount');
                    const amountPaid = getTotalForField(filteredInvoices, 'amountPaid');

                    invoice.totalAmount = totalAmount;
                    invoice.amountPaid = amountPaid;
                    preparedInvoices.push(invoice);
                }

            }

        });

        return preparedInvoices;
    }


    prepareInvoiceForEachUser(useId: string, invoices: InvoiceInterface[]) {
        const filteredInvoices = invoices.filter(invoice => invoice.buyerId === useId || invoice.sellerId === useId);
        return filteredInvoices;
    }


    private async getInvoicesPromise(payload: { organizationId: string, invoiceType?: InvoiceEnums, userId?: string }) {
        const { organizationId, invoiceType, userId } = payload;
        if (userId) {
            const clonedPayload: any = cloneDeep(payload);
            clonedPayload.userId = userId;
            return this.getInvoicePromiseByUserId(clonedPayload);
        }
        if (!invoiceType) {
            return this.getAll(organizationId);
        }
        return this.getByField({ organizationId, payload: { field: 'invoiceType', value: invoiceType } });
    }


    async getInvoicePromiseByUserId(payload: { organizationId: string, invoiceType?: InvoiceEnums, userId: string }) {
        const { organizationId, invoiceType, userId } = payload;
        const promises: any[] = [
            this.getByField({ organizationId, payload: { field: 'buyerId', value: userId } }),
            this.getByField({ organizationId, payload: { field: 'sellerId', value: userId } }),
        ];
        const invoicesFromDB = await resolveMultiplePromises(promises);
        const combined = invoicesFromDB[0].concat(invoicesFromDB[1]);

        let allInvoices = combined;
        if (invoiceType) {
            allInvoices = allInvoices.filter(invoice => invoice.invoiceType === invoiceType);
        }

        const invoices = sortArrayByKey('createdAt', 'DESC', allInvoices);
        return invoices;
    }




    async getInvoicesForEachUser(data: DBRequestInterface) {
        const { id, organizationId, payload } = data;
        const { userId, invoiceType } = payload;
        const query: MultipleFieldRequestInterface = {
            payload: {
                fields: [
                    {
                        field: 'invoiceType',
                        value: invoiceType,
                    },
                    {
                        field: 'status',
                        value: 'Pending',
                    },
                ],
                queryType: 'matchAll',
            },
            collection: this.collection,
            organizationId
        };

        let usersArray: UserInterface[] = [];

        if (userId) {
            const user = await this.databaseService.getItem({ id: userId, organizationId, collection: DatabaseCollectionEnums.USERS });
            if (!user) throw new Error('User not found');
            usersArray = [user];
        } else {
            usersArray = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.USERS });
        }
        const invoices: InvoiceInterface[] = await this.getByMultipleFields(query);
        // const pendingInvoices = invoices.filter((invoice) => invoice.status === 'Pending');
        const modifiedInvoces: InvoiceInterface[] = [];


        usersArray.forEach(async (user) => {
            // const userInvoices = invoices.filter((invoice) => invoice.buyerId === user.id || invoice.sellerId === user.id);
            let userInvoices = invoices.filter((invoice) => invoice.buyerId === user.id);
            const sellerInvoices = invoices.filter((invoice) => invoice.sellerId === user.id);
            userInvoices = userInvoices.concat(sellerInvoices);
            const totalAmount = getTotalForField(userInvoices, 'totalAmount');

            const amountPaid = getTotalForField(userInvoices, 'amountPaid');

            const invoice = userInvoices[0];
            if (!invoice) return;
            invoice.buyerName = user.name;
            invoice.totalAmount = totalAmount;
            invoice.amountPaid = amountPaid;

            modifiedInvoces.push(invoice);
            // modifiedInvoces.push(...userInvoices);
        });
        return modifiedInvoces;
    }

    async getInvoiceForSingleUser(request: DBRequestInterface) {
        const { id, organizationId, payload } = request;

        const { userId, invoiceType } = payload;

        const query: MultipleFieldRequestInterface = {
            payload: {
                fields: [
                    {
                        field: 'invoiceType',
                        value: invoiceType,
                    },
                    {
                        field: 'userId',
                        value: userId,
                    },

                ],
                queryType: 'matchAll',
            },
            collection: this.collection,
            organizationId
        };


        const invoices = await this.getByMultipleFields(query);
        const pendingInvoices = invoices.filter((invoice) => invoice.status === 'Pending' || !invoice.status);
        const completedInvoices = invoices.filter((invoice) => invoice.status === 'Completed');

        const allInvoices = pendingInvoices.concat(completedInvoices);

        const modifiedINvoices: InvoiceInterface[] = [];
        const user = await this.databaseService.getItem({ id: userId, organizationId, collection: DatabaseCollectionEnums.USERS });

        if (!allInvoices?.length || !user) return [];

        allInvoices.forEach((invoice) => {
            invoice.buyerName = user.name;
            modifiedINvoices.push(invoice);
        });
        return modifiedINvoices;
    }


    async getInvoiceRevenues(data: DBRequestInterface): Promise<any> {
        const { organizationId, id, payload } = data;
        const { fieldToCheck } = payload;

        // Retrieve invoices based on organizationId and invoiceType
        const invoices = await this.getAll(organizationId);

        // Extract unique buyer IDs from invoices
        const ids = uniqueArrayItems(getFieldValuesFromArray(fieldToCheck, invoices));
        const categorized = [];

        ids.forEach(async (id) => {
            const invoice = await this.categorizeInvoicesByDateRange(id, invoices);

            if (invoice) {
                categorized.push(invoice);
            }
        });

        // Categorize invoices by date range for each buyerId

        return categorized;
    }

    private async categorizeInvoicesByDateRange(buyerId: string, allInvoices: InvoiceInterface[]): Promise<InvoiceRevenueInterface | null> {
        const invoices = allInvoices.filter(i => i.buyerId === buyerId);
        const selected = invoices[0];
        if (!selected) {
            return null;
        }

        const comingDue = await this.prepareInvoiceStats(invoices, { startDay: 0, endDay: -30 });
        const thirtyToSixtyDays = await this.prepareInvoiceStats(invoices, { startDay: -31, endDay: -60 });
        const sixtyToNinetyDays = await this.prepareInvoiceStats(invoices, { startDay: -61, endDay: -90 });
        const aboveNinetyDays = await this.prepareInvoiceStats(invoices, { startDay: -91, endDay: -90 * 100 });
        const revenuesArray: any[] = [comingDue, thirtyToSixtyDays, sixtyToNinetyDays, aboveNinetyDays];
        const totalDebits = getTotalForField(revenuesArray, 'totalDebits');
        const totalCredits = getTotalForField(revenuesArray, 'totalCredits');

        const revenue: InvoiceRevenueInterface = {
            customerName: selected?.buyerName || selected?.serialNumber || 'INVOICE',
            customerId: selected?.buyerId || 'INV',
            invoiceType: selected.invoiceType,
            comingDue,
            thirtyToSixtyDays,
            sixtyToNinetyDays,
            aboveNinetyDays,
            totalDebits,
            totalCredits,
            balance: totalDebits - totalCredits,
        }
        return revenue;
    }

    private async prepareInvoiceStats(invoices: InvoiceInterface[], dateRange: { startDay: number, endDay: number }): Promise<InvoiceStatsInterface> {
        return new Promise<InvoiceStatsInterface>((resolve, reject) => {
            const { startDay, endDay } = dateRange;

            // Normalize the startDate and endDate to the start of the day (midnight)
            const startDate = new Date(jumpToXNumberOfDays({ daysToJump: startDay })).setHours(0, 0, 0, 0);
            const endDate = new Date(jumpToXNumberOfDays({ daysToJump: endDay })).setHours(23, 59, 59, 999); // End of the day
            const filtered: InvoiceInterface[] = [];
            invoices.forEach((invoice) => {
                // Normalize the invoiceDate to the start of the day (midnight)
                const invoiceDate = new Date(invoice.createdAt).setHours(0, 0, 0, 0);


                if (invoiceDate >= endDate && invoiceDate <= startDate) {
                    filtered.push(invoice);
                }
            });


            const total = getTotalForField(filtered, 'totalAmount');
            const amountPaid = getTotalForField(filtered, 'amountPaid');
            const balance = total - amountPaid;

            const result: InvoiceStatsInterface = {
                totalAmount: balance,
                numberOfInvoices: filtered.length,
                totalDebits: total,
                totalCredits: amountPaid,
            }

            resolve(result);
        })
    }



    async getUserInvoices(data: DBRequestInterface) {
        const { id, payload, organizationId } = data;
        const { userId, fieldToCheck, saleType } = payload;

        const invoices = await this.getByField({ organizationId, payload: { field: 'buyerId', value: userId } });

        const filteredInvoices: InvoiceInterface[] = invoices.filter(invoice => invoice.invoiceType === saleType && invoice.amountPaid !== invoice.totalAmount);
        return sortArrayByKey('createdAt', 'DESC', filteredInvoices);
    }
}
