/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseAutomationService } from 'src/modules/base/base-automation/base-automation.service';
import { MemberEventsEnum } from './members-events.enum';
import { MemberInterface } from 'src/shared/interfaces/members.interface';
import { SubscriptionInterface, SubscriptionTypeEnum } from 'src/shared/interfaces/subscriptions.interface';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceItemsInterface, InvoiceUserTypeEnum, PurchaseTypeEnum } from 'src/modules/invoices/invoices.interface';
import { getBeginningOfDayFromDate } from 'src/shared/functions/date-time.functions';
import { generateUniqueId } from 'src/database/database.functions';
import { getTotalForField } from 'victor-dev-toolbox';
import { DefaultAccountEnums } from 'src/modules/accounting/accounting.interface';

@Injectable()
export class MembersAutomationService extends BaseAutomationService {
    constructor() {
        super();
    }

    @OnEvent(MemberEventsEnum.MEMBER_CREATED)
    async onMemberCreated(payload: { member: MemberInterface, organizationId: string }) {
        const saveInvoices = await this.createOneTimeSubscriptionInvoices(payload);
        // Add all to invoice
        //  Endpoint to process invoices and activate user
    }

    private async createOneTimeSubscriptionInvoices(payload: { member: MemberInterface, organizationId: string }) {
        const { member, organizationId } = payload;
        //  Get all One time Subscriptions
        const oneTimeSubscriptions: SubscriptionInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'type', value: SubscriptionTypeEnum.ONE_TIME, collection: DatabaseCollectionEnums.SUBSCRIPTIONS });
        const items: InvoiceItemsInterface[] = [];
        oneTimeSubscriptions.forEach(s => {
            const item: InvoiceItemsInterface = {
                id: generateUniqueId(),
                name: s.name,
                quantity: 1,
                unitPrice: s.price,
                productId: s.id,
                total: s.price,
                day: getBeginningOfDayFromDate(new Date().toISOString()),

            }
            items.push(item);
        });
        const invoice: InvoiceInterface = {
            id: generateUniqueId(),
            name: member.name,
            description: ``,
            invoiceType: InvoiceEnums.ONE_TIME,
            items,
            totalAmount: getTotalForField(items, 'total'),
            amountPaid: 0,
            currency: "KES",
            buyerId: member.id,
            sellerId: organizationId,
            accountId: DefaultAccountEnums.MEMBERSHIP_FEES,
            day: getBeginningOfDayFromDate(new Date().toISOString()),
            category: InvoiceCategoryEnum.SALE,
            buyerName: member.name,
            sellerName: "",
            userType: InvoiceUserTypeEnum.MEMBER,
            subscription: false,
            buyerPhone: member.phone || '',
            sellerPhone: "",
            email: member.email,
            createdBy: "SYSTEM"
        };
        const save = await this.databaseService.createItem({ id: invoice.id, collection: DatabaseCollectionEnums.INVOICES, organizationId, itemDto: invoice });

    }
}
