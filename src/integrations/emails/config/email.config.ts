/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
import { TransportOptions } from 'nodemailer';
import { DefaultApplicationData } from 'src/shared/data/application.data';


export const DefaultEmailConfig: any = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    senderName: DefaultApplicationData.shortName,
    senderAddress: "solbysystems@gmail.com",
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
}