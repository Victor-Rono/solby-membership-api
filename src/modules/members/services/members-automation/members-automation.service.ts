/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { MemberEventsEnum } from './members-events.enum';
import { MemberAccountInterface, MemberInterface } from 'src/shared/interfaces/members.interface';
import { SubscriptionInterface, SubscriptionTypeEnum } from 'src/shared/interfaces/subscriptions.interface';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { InvoiceCategoryEnum, InvoiceEnums, InvoiceInterface, InvoiceItemsInterface, InvoiceUserTypeEnum, PurchaseTypeEnum } from 'src/modules/invoices/invoices.interface';
import { getBeginningOfDayFromDate } from 'src/shared/functions/date-time.functions';
import { generateUniqueId } from 'src/database/database.functions';
import { getTotalForField } from 'victor-dev-toolbox';
import { DefaultAccountEnums } from 'src/modules/accounting/accounting.interface';
import { SmsService } from 'src/modules/notifications/sms/services/sms/sms.service';
import { SMSEventsEnum, SMSInterface } from 'src/shared/interfaces/sms.interface';
import { MembersService } from '../members/members.service';
import { InvoiceManagerService } from 'src/modules/invoices/services/invoice-manager/invoice-manager.service';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { MemberSubscriptionsService } from '../member-subscriptions/member-subscriptions.service';
import { AuthService } from 'src/modules/auth/services/auth/auth.service';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { convertMemberToUser } from 'src/shared/functions/members.functions';
import { PermissionEnums } from 'src/shared/interfaces/permission.interface';
import { CreatePermissionFromEnums } from 'src/modules/permissions/permissions.functions';
import { UsersService } from 'src/modules/users/services/users/users.service';

@Injectable()
export class MembersAutomationService extends BaseAutomationService {
    constructor(
        private smsService: SmsService,
        private membersService: MembersService,
        private invoiceManagerService: InvoiceManagerService,
        private memberSubscriptionService: MemberSubscriptionsService,
        // private authService: AuthService,
        // private usersService: UsersService,
    ) {
        super();
    }

    @OnEvent(MemberEventsEnum.MEMBER_CREATED)
    async onMemberCreated(payload: { member: MemberInterface, organizationId: string }) {
        const saveInvoices = await this.createOneTimeSubscriptionInvoices(payload);
        // Add all to invoice
        //  Endpoint to process invoices and activate user
    }

    @OnEvent(MemberEventsEnum.SUBSCRIPTIONS)
    async subscriptions() {
        this.memberSubscriptionService.sendSubscriptions();
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
        this.resolveInvoicePayments({ id: member.id, organizationId })
        const notify = await this.notifyMember(payload);

    }

    private async resolveInvoicePayments(request: { id: string, organizationId: string }) {
        const { id, organizationId } = request;
        const account = await this.databaseService.getItem({ organizationId, id, collection: DatabaseCollectionEnums.MEMBER_ACCOUNTS });
        const currentAmount = account?.amount;
        if (!currentAmount) return;
        const invoices = await this.membersService.getAllPendingSingleMemberInvoices({ id, organizationId });
        let current = currentAmount;
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

            promises.push(this.invoiceManagerService.payForInvoice({ organizationId, payload: { amountPaid } }));
        })
        const resolved = await resolveMultiplePromises(promises);

    }


    private async notifyMember(payload: { member: MemberInterface, organizationId: string }) {
        const { member, organizationId } = payload;

        const sms: SMSInterface = {
            organizationId,
            phone: member.phone,
            message: this.getNotificationMessage(member),
            // response?: any;
        };
        const sendSms = await this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, sms);
        return sendSms;
    }

    private getNotificationMessage(member: MemberInterface) {
        const message = `Hello ${member.name}, Welcome to our Membership platform. To continue, please pay your membership fee.`;
        return message;
    }

    // async saveMemberUser(payload: { member: MemberInterface, organizationId: string }) {
    //     const user: UserInterface = convertMemberToUser(payload);
    //     const save = await this.usersService.registerUser({ user, organizationId: payload.organizationId, permissions: [] })
    // }

    // private async registerUser(payload: { id?: string, user: UserInterface, organizationId: string, permissions: PermissionEnums[] }) {

    //     const { user, organizationId, permissions } = payload;

    //     let result: any = false;

    //     const email = user.email;
    //     if (!email) {
    //         throw new Error("Email is required");
    //     }
    //     const AllUsers: UserInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'email', value: user.email, collection: DatabaseCollectionEnums.MEMBER_USER });
    //     const userInDB = AllUsers[0];
    //     if (userInDB) {

    //         const userOrgs = userInDB.organizations || [];

    //         if (!userOrgs.includes(organizationId)) {
    //             if (!user.organizations) {
    //                 user.organizations = userOrgs || [];
    //             }
    //             user?.organizations.push(organizationId);
    //         }
    //         // delete (user.id);
    //         user.id = userInDB.id;


    //         // const update = await this.update({
    //         //     id: userInDB.id, payload: user, organizationId
    //         // });
    //         const update = await this.databaseService.updateItem({ id: user.id, itemDto: user, organizationId: "", collection: DatabaseCollectionEnums.MEMBER_USER });
    //         // Send An Email to the User
    //         // this.eventEmitter.emit(UserEventsEnum.USER_INVITED_TO_ORGANIZATION, { userId: userInDB.id, organizationId });
    //         result = update;

    //     } else {
    //         const id = user.id || generateUniqueId();
    //         user.organizations = [organizationId];
    //         const createUser = await this.databaseService.createItem({ id: user.id, organizationId, itemDto: user, collection: DatabaseCollectionEnums.MEMBER_USER });
    //         result = createUser;
    //         // Send An Email to the User
    //         // this.eventEmitter.emit(UserEventsEnum.USER_INVITED_TO_ORGANIZATION, { userId: id, organizationId });
    //     }
    //     // if (result?.id) {
    //     //     const createdPermissions = CreatePermissionFromEnums({ id: result.id, permissionEnums: permissions });

    //     //     const savePermissions = await this.authService.savePermissions({ userId: result.id, permissions: createdPermissions, organizationId });

    //     // }

    //     return result;
    // }

}
