/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
import { TransportOptions } from 'nodemailer';


export const DefaultEmailConfig: any = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    senderName: "MAZIWA TELE",
    senderAddress: "support@maziwatele.com",
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
}