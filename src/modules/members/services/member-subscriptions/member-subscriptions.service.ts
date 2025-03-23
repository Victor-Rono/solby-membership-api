/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { DatabaseCollectionEnums } from "src/database/database.interface";
import { DatabaseService } from "src/database/database.service";
import { DefaultAccountEnums } from "src/modules/accounting/accounting.interface";
import { InvoiceInterface, InvoiceEnums, InvoiceCategoryEnum, InvoiceUserTypeEnum, InvoiceItemsInterface } from "src/modules/invoices/invoices.interface";
import { SmsService } from "src/modules/notifications/sms/services/sms/sms.service";
import { subscriptionConfigId, DefaultSubscriptionConfig } from "src/modules/subscriptions/data/subscriptions.data";
import { TenantInterface } from "src/modules/tenants/interfaces/tenants.interface";
import { convertToDDMMYYYY, getBeginningOfDayFromDate } from "src/shared/functions/date-time.functions";
import { MemberAccountInterface, MemberInterface } from "src/shared/interfaces/members.interface";
import { SMSInterface } from "src/shared/interfaces/sms.interface";
import { SubscriptionConfigInterface, SubscriptionInterface, SubscriptionTypeEnum } from "src/shared/interfaces/subscriptions.interface";
import { generateUniqueId, getTotalForField, jumpToXNumberOfDays, resolveMultiplePromises } from "victor-dev-toolbox";
import { MembersService } from "../members/members.service";
import { totalForAllInvoices } from "src/shared/functions/invoices.functions";
import { BaseAutomationService } from "src/modules/base/base-automation/base-automation.service";
import { SMSEventsEnum } from '../../../../shared/interfaces/sms.interface';

@Injectable()
export class MemberSubscriptionsService extends BaseAutomationService {
    constructor(
        // private databaseService: DatabaseService,
        private smsService: SmsService,
        private membersService: MembersService,

    ) {
        super();
    }

    async sendSubscriptions() {
        const organizations: TenantInterface[] = await this.databaseService.getAllItems({
            organizationId: '',
            collection: DatabaseCollectionEnums.TENANTS
        });

        await Promise.all(organizations.map(org => this.sendSubsForSingleOrg(org)));
    }

    private async createMemberSubscriptions(payload: { member: MemberInterface, subscriptions: SubscriptionInterface[], organizationId: string }) {
        const { member, subscriptions, organizationId } = payload;
        const items = this.createInvoiceItems(subscriptions);

        const organization = await this.databaseService.getItem({
            organizationId,
            id: organizationId,
            collection: DatabaseCollectionEnums.TENANTS
        });

        const invoice: InvoiceInterface = {
            id: generateUniqueId(),
            name: `Monthly Membership Fees`,
            description: `Monthly Membership Fees Invoice, ${convertToDDMMYYYY()}`,
            invoiceType: InvoiceEnums.SUBSCRIPTION,
            items,
            totalAmount: getTotalForField(items, 'unitPrice'),
            amountPaid: 0,
            currency: "KES",
            buyerId: member.id,
            sellerId: organizationId,
            accountId: DefaultAccountEnums.MEMBERSHIP_FEES,
            day: getBeginningOfDayFromDate(),
            category: InvoiceCategoryEnum.SALE,
            buyerName: member.name,
            sellerName: organization?.shortName || '',
            userType: InvoiceUserTypeEnum.MEMBER,
            buyerPhone: member.phone,
            sellerPhone: organization?.phone || '',
            email: member.email,
            createdBy: 'SYSTEM'
        };

        return await this.databaseService.createItem({
            organizationId,
            id: invoice.id,
            itemDto: invoice,
            collection: DatabaseCollectionEnums.INVOICES
        });
    }


    private createInvoiceItems(subscriptions: SubscriptionInterface[]): InvoiceItemsInterface[] {
        return subscriptions.map(s => ({
            id: generateUniqueId(),
            name: s.name,
            quantity: 1,
            unitPrice: s.price,
            total: s.price,
            day: getBeginningOfDayFromDate(),
            description: s.name,
        }));
    }

    private async sendSubsForSingleOrg(organization: TenantInterface) {
        const organizationId = organization.id;
        const config: SubscriptionConfigInterface = await this.databaseService.getItem({
            id: subscriptionConfigId,
            organizationId,
            collection: DatabaseCollectionEnums.SUBSCRIPTIONS_CONFIG
        }) || DefaultSubscriptionConfig;

        const monthly = config.monthly;
        const day = new Date().getDate();

        const members = await this.getAllMembersWithPendingInvoices(organizationId);

        if (day === monthly) {

            const subscriptions = await this.databaseService.getItemsByField({
                organizationId,
                field: 'type',
                value: SubscriptionTypeEnum.MONTHLY,
                collection: DatabaseCollectionEnums.SUBSCRIPTIONS
            });

            const promises = members.map(member =>
                this.createMemberSubscriptions({ member, subscriptions, organizationId })
            );

            return await resolveMultiplePromises(promises);
            this.deductFromSavings(organizationId);
        } else {
            const daysLeft = monthly - day;
            this.notifyAllMembers({ members, daysLeft, organizationId });

        }



    }

    private async notifyAllMembers(payload: { members: MemberInterface[], daysLeft: number, organizationId: string }) {
        const { members, daysLeft, organizationId } = payload;

        const organization: TenantInterface = await this.databaseService.getItem({
            organizationId,
            id: organizationId,
            collection: DatabaseCollectionEnums.TENANTS
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        const phone = organization.phone;



        const futureDate = convertToDDMMYYYY(jumpToXNumberOfDays({ daysToJump: daysLeft }));

        members.forEach(member => {
            let message: string | null = null;
            if (daysLeft === 5) {
                message = `Dear ${member.name}, your membership fee is due on ${futureDate}. Please make the payment soon.`;
            } else if (daysLeft === 2) {
                message = `Dear ${member.name}, your membership fee is due  due on ${futureDate}. You have 2 days. Kindly ensure payment is made.`;
            } else if (daysLeft === 1) {
                message = `Dear ${member.name}, your monthly membership fee is due tomorrow. Don't forget to pay.`;
            } else if (daysLeft === 0) {
                message = `Dear ${member.name}, your monthly membership fee is due today. Kindly make payments`;
            }

            if (!message) return;


            const sms: SMSInterface = {
                phone,
                message,
                organizationId
            };
            this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, sms);

        });


        // const messages = members.map(member => {
        // 
        //     // return { phone: member.phone, message };

        // });

        // await Promise.all(messages.map(msg => this.smsService.sendSms(msg.phone, msg.message)));
    }


    private async deductFromSavings(organizationId: string) {
        const members: MemberInterface[] = await this.getAllMembersWithPendingInvoices(organizationId);
        members.forEach(m => {
            this.membersService.resolveInvoicePayments({ organizationId, id: m.id });
        })
    }



    private async getAllMembersWithPendingInvoices(organizationId: string): Promise<MemberInterface[]> {
        const filteredMembers: MemberInterface[] = [];
        const members: MemberInterface[] = await this.membersService.getAll(organizationId);
        const memberAccounts: MemberAccountInterface[] = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS });
        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$sellerId", organizationId] },
                    // { $eq: ["$buyerId", id] }
                ]
            }
        };
        const invoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });
        members.forEach(m => {
            const account = memberAccounts.find(a => a.id === m.id);
            const filteredInvoices = invoices.filter(i => i.buyerId === m.id);
            if (!account?.amount || !filteredInvoices.length) return;
            const totalPending = totalForAllInvoices(filteredInvoices).totalDue;
            if (account.amount >= totalPending) return;
            filteredMembers.push(m);

        });
        return filteredMembers;
    }



}
