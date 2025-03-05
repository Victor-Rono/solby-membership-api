/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DefaultEmailConfig } from '../../config/email.config';
import { EmailInterface } from '../../emails.interface';

@Injectable()
export class EmailsService {

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




}

