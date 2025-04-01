/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DefaultEmailConfig } from '../../config/email.config';
import { EmailInterface } from '../../emails.interface';
import { BaseAutomationService } from 'src/modules/base/services/base-automation/base-automation.service';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { generateUniqueId } from 'src/database/database.functions';

@Injectable()
export class EmailsService extends BaseAutomationService {

    emailTransport() {
        const transporter = nodemailer.createTransport(
            DefaultEmailConfig
        )
        return transporter;
    }

    async sendEmail(email: EmailInterface) {
        const transport = this.emailTransport();

        const options: nodemailer.SendMailOptions = {
            // from: DefaultEmailConfig.senderName,
            from: {
                name: DefaultEmailConfig.senderName,
                address: DefaultEmailConfig.senderAddress // or your Google Workspace email
            },
            to: email.recipients,
            subject: email.subject,
            html: email.html,
            attachments: email.attachments,
        }

        try {
            const send = await transport.sendMail(options);

        } catch (error) {
            console.error(error);

        }

    }

    // async saveEmail(email: EmailInterface) {
    //     delete email.attachments;
    //     return this.databaseService.createItem({ id: generateUniqueId(), itemDto: email, collection: DatabaseCollectionEnums.EMAILS, organizationId: "EMAILS" });
    // }




}

