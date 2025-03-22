/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { DatabaseCollectionEnums } from "src/database/database.interface";
import { DatabaseService } from "src/database/database.service";
import { DefaultAccountEnums } from "src/modules/accounting/accounting.interface";
import { InvoiceInterface, InvoiceEnums, InvoiceCategoryEnum, InvoiceUserTypeEnum, InvoiceItemsInterface } from "src/modules/invoices/invoices.interface";
import { SmsService } from "src/modules/notifications/sms/services/sms/sms.service";
import { subscriptionConfigId, DefaultSubscriptionConfig } from "src/modules/subscriptions/data/subscriptions.data";
import { TenantInterface } from "src/modules/tenants/interfaces/tenants.interface";
import { getBeginningOfDayFromDate } from "src/shared/functions/date-time.functions";
import { MemberInterface } from "src/shared/interfaces/members.interface";
import { SubscriptionInterface, SubscriptionTypeEnum } from "src/shared/interfaces/subscriptions.interface";
import { generateUniqueId, getTotalForField, resolveMultiplePromises } from "victor-dev-toolbox";

@Injectable()
export class MemberSubscriptionsService {
    constructor(
        private databaseService: DatabaseService,
        private smsService: SmsService,
    ) { }

    private async sendSubscriptions() {
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
            description: `Monthly Membership Fees`,
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
        const config = await this.databaseService.getItem({
            id: subscriptionConfigId,
            organizationId,
            collection: DatabaseCollectionEnums.SUBSCRIPTIONS_CONFIG
        }) || DefaultSubscriptionConfig;

        const monthly = config.monthly;
        const members = await this.databaseService.getAllItems({
            organizationId,
            collection: DatabaseCollectionEnums.MEMBERS
        });
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
    }

    private async notifyAllMembers(payload: { members: MemberInterface[], daysLeft: number }) {
        const { members, daysLeft } = payload;

        const messages = members.map(member => {
            let message = '';
            if (daysLeft === 5) {
                message = `Reminder: ${member.name}, your membership fee is due in 5 days. Please make payment soon.`;
            } else if (daysLeft === 2) {
                message = `Reminder: ${member.name}, your membership fee is due in 2 days. Kindly ensure payment is made.`;
            } else if (daysLeft === 1) {
                message = `Hi ${member.name}, your membership fee is due tomorrow. Don't forget to pay.`;
            } else if (daysLeft === 0) {
                message = `Hello ${member.name}, your membership fee is due today. Please make payment immediately.`;
            }
            return { phone: member.phone, message };
        });

        await Promise.all(messages.map(msg => this.smsService.sendSms(msg.phone, msg.message)));
    }

    private getDaysLeft(targetDay: number): number {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Ensure the target day is within the month (avoiding 29, 30, 31 issues in February)
        const targetDate = new Date(currentYear, currentMonth, targetDay);

        // Calculate the difference in days
        const diffInMs = targetDate.getTime() - today.getTime();
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

}
