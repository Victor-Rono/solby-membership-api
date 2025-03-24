/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseService } from 'src/modules/base/base.service';
import { UserEventsEnum } from './user-events.enum';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { invitationTemplate } from 'src/integrations/emails/templates/auth/invitation.template';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { SMSEventsEnum, SMSInterface } from 'src/shared/interfaces/sms.interface';

@Injectable()
export class UsersAutomationService extends BaseService<any, any, any, any> {
    constructor(
        private emailService: EmailsService
    ) {
        super();
    }

    @OnEvent(UserEventsEnum.USER_INVITED_TO_ORGANIZATION)
    async userInvitedToOrganization(payload: { userId: string, organizationId: string }) {
        const { userId, organizationId } = payload;
        const user: UserInterface = await this.databaseService.getItem({ id: userId, organizationId, collection: DatabaseCollectionEnums.USERS });
        const organization: OrganizationInterface = await this.databaseService.getItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        if (!user || !organization) throw new Error("User or Organization not found");
        const template = await invitationTemplate({ userName: user.name, organization });
        const email: EmailInterface = {
            recipients: [user.email],
            subject: `Invitation to join ${organization.shortName}`,
            html: template,
            attachments: [],

        }
        const sms: SMSInterface = {
            phone: user.phone,
            message: `Hello ${user.name}, you have been invited to join ${organization.shortName}. Please Call ${organization.phoneNumber} for any assistance.`,
            organizationId
        }
        const send = this.emailService.sendEmail(email);
        this.eventEmitter.emit(SMSEventsEnum.SEND_SMS, sms);
    }

}
