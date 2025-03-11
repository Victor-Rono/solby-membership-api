/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseCollectionEnums, DBRequestInterface } from "src/database/database.interface";
import { BaseService } from "src/modules/base/base.service";
import { SmsService } from "src/modules/notifications/sms/services/sms/sms.service";
import { UserInterface, UserVerificationInterface, UserAuthenticationInterface, PasswordResetInterface } from "src/shared/interfaces/user.interface";
import { generateUniqueId } from "victor-dev-toolbox";
import { OTPInterface } from "../../otp.dto";
import { compare, hash } from "bcrypt";
import { TokensService } from "src/modules/tokens/services/tokens/tokens.service";
import { resetPasswordTemplate } from "src/integrations/emails/templates/auth/reset-password.template";
import { ProdFrontendURL } from "src/shared/data/application.data";
import { EmailsService } from "src/integrations/emails/services/emails/emails.service";
import { EmailInterface } from "src/integrations/emails/emails.interface";

@Injectable()
export class AuthService extends BaseService<any, any, any, any> {

    constructor(
        private smsService: SmsService,
        private tokensService: TokensService,
        private emailService: EmailsService,
    ) {
        super();
    }
    async sendOtp(userId: string) {
        const user: UserInterface | null = await this.databaseService.getItem({ id: userId, collection: DatabaseCollectionEnums.USERS, organizationId: '' });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        const phone = user.phone;
        const saveOTP = await this.saveOtp(userId);

        const send = await this.smsService.sendSMS({
            organizationId: '',
            phone,
            message: `Your OTP for Maziwa Tele is ${saveOTP.otp}. If you Didn't request for OTP, please ignore this message.`,
        });
        return send;

    }


    async verifyOtp(payload: { userId: string, otp: string }): Promise<boolean> {
        const { userId, otp } = payload;
        const collection = DatabaseCollectionEnums.OTP;
        const otps = await this.databaseService.getAllItems({ collection, organizationId: '' });

        const otpFromDB = await this.databaseService.getItem({ id: userId, collection, organizationId: '' });

        if (!otpFromDB) {

            return false;
        }

        const expiryDate = Number(otpFromDB.expiryDate);
        const now = new Date().getTime();
        if (now > expiryDate) {

            const deleted = await this.databaseService.deleteItem({ id: userId, collection, organizationId: '' });
            return false;
        }

        if (otpFromDB.otp === otp) {


            const deleted = await this.databaseService.deleteItem({ id: userId, collection, organizationId: '' });
            return true;
        } else {



            return false;
        }
    }


    async saveOtp(userId: string) {
        const collection = DatabaseCollectionEnums.OTP;

        const otpFromDB = await this.databaseService.getItem({ id: userId, collection, organizationId: '' });
        if (otpFromDB && otpFromDB.id) {
            const deleted = await this.databaseService.deleteItem({ id: userId, collection, organizationId: '' });

        }

        const randomOtp = Math.floor(1000 + Math.random() * 99999).toString().padStart(5, '0');
        const futureTime = new Date(new Date().getTime() + 1000 * 60 * 10).getTime();
        // const expiryDate = futureTime.toISOString().split('T')[0];
        const payload: OTPInterface = {
            id: userId,
            otp: randomOtp,
            expiryDate: futureTime,
            createdBy: userId,
        }

        const save = await this.databaseService.createItem({ id: generateUniqueId(), collection, itemDto: payload, organizationId: '' });
        return save;

    }

    async verifyEmail(payload: { organizationId: string, email: string }) {
        const { organizationId, email } = payload;
        const usersFromDB = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.USERS });
        const user = usersFromDB.find((user) => user.email === email);

        const users = await this.databaseService.getItemsByField({ organizationId, field: 'email', value: email, collection: DatabaseCollectionEnums.USERS });

        // const user = users[0];

        const userFromDB: UserVerificationInterface = {
            status: 'NOT_INVITED',
            user,
        }
        // if user exists, check status
        if (user && !user.verified) {
            userFromDB.status = 'PENDING';
        }

        if (user && user.verified) {
            userFromDB.status = 'VERIFIED';
        }

        return userFromDB;

    }


    async login(data: DBRequestInterface): Promise<UserAuthenticationInterface> {

        const { organizationId, payload } = data;



        const { email, password } = payload;
        const usersFromDb: UserInterface[] = await this.databaseService.getItemsByField({ field: 'email', value: email, collection: DatabaseCollectionEnums.USERS, organizationId });
        const user = usersFromDb[0] || null;

        console.log({ user });

        if (!user) {
            return { token: null, user: null };
        }

        const token = await this.createAuthToken(user.id, "login");

        if (!user.verified) {
            const createCredentials = await this.createUserCredentials({ userId: user.id, password });
            console.log({ user, token });

            return { token, user };


        } else {
            const validatePassword = await this.verifyPassword({ userId: user.id, password: password });

            if (!validatePassword) {
                return { token: null, user: null };
            }
            return { token, user };
        }

    }

    async resetPassword(data: DBRequestInterface): Promise<boolean> {
        const { organizationId, payload } = data;
        const { email } = payload;
        let result = false;
        // if (!email) {
        //     throw new Error('Email is required');
        // }
        const usersFromDB: UserInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'email', value: email, collection: DatabaseCollectionEnums.USERS });
        const user = usersFromDB[0] || null;

        if (!user) {
            // throw new Error('User not found');
            return result;
        }
        const create = await this.createPasswordReset(user.id);

        if (create) {
            // const emailTemplate = resetPasswordTemplate({ userName: user.name, resetPasswordLink: `${ProdFrontendURL}/reset-password/${create.token}` });
            const emailTemplate = resetPasswordTemplate({ userName: user.name, resetPasswordLink: `${ProdFrontendURL}/reset-password/${create.token}` });

            const email: EmailInterface = {
                recipients: [user.email],
                subject: 'Password Reset',
                html: emailTemplate,
                attachments: [],
            };
            const sendEmail = this.emailService.sendEmail(email);

        }
        result = true;
        return result;

        // Create a password reset token

    }


    async createUserCredentials(data: { userId: string; password: string }): Promise<any> {
        const { userId, password } = data;
        // Hash the password
        const hashedPassword = await hash(data.password, 10);

        // Create the credential document
        const id = generateUniqueId();
        const record = {
            id: userId,
            password: hashedPassword,
        }

        const current = await this.databaseService.getItem({ id: userId, collection: DatabaseCollectionEnums.CREDENTIALS, organizationId: '' });

        if (current) {
            const deleted = await this.databaseService.deleteItem({ id: userId, collection: DatabaseCollectionEnums.CREDENTIALS, organizationId: '' });
        }

        const newCredential = await this.databaseService.createItem({ id: userId, collection: DatabaseCollectionEnums.CREDENTIALS, itemDto: record, organizationId: '' });

        const verify = await this.databaseService.updateItem({ id: userId, collection: DatabaseCollectionEnums.USERS, itemDto: { verified: true }, organizationId: '' });

        return newCredential;
    }

    async updateUserPassword(data: { userId: string; password: string }): Promise<any> {
        const { userId, password } = data;
        // Hash the password
        const hashedPassword = await hash(data.password, 10);
        // Create the credential document
        const update = await this.databaseService.updateItem({ id: userId, collection: DatabaseCollectionEnums.CREDENTIALS, itemDto: { password: hashedPassword }, organizationId: '' });
        return update;
    }

    async verifyPassword(data: { userId: string, password: string }): Promise<boolean> {
        const { userId, password } = data;

        const credential = await this.databaseService.getItem({ id: userId, collection: DatabaseCollectionEnums.CREDENTIALS, organizationId: '' });

        if (!credential) {
            return false;
        }
        const isPasswordValid = await compare(password, credential.password);
        return isPasswordValid;
    }

    async createAuthToken(userId: string, tokenType: string): Promise<string> {
        const payload = {
            id: userId,
            tokenType,
        };
        const token = await this.tokensService.generateRefreshToken(payload);
        return token;
    }

    async createPasswordReset(userId: string): Promise<PasswordResetInterface | null> {
        const expiryInterval = 60 * 60 * 1000; // 1 hour
        const expiryTimeInSeconds = Date.now() + expiryInterval;
        const expiresAt = new Date(expiryTimeInSeconds).toISOString();

        try {
            // Attempt to remove any existing reset record for this user
            const removeResult = await this.databaseService.deleteItem({
                id: userId,
                collection: DatabaseCollectionEnums.PASSWORD_RESETS,
                organizationId: ''
            });

            // Prepare the new password reset object
            const reset: PasswordResetInterface = {
                id: userId, // Ensure unique ID for this operation
                userId,
                expiresAt,
                token: generateUniqueId(), // Generate unique reset token
                createdBy: userId,
                createdAt: new Date().toISOString(),
            };

            // Attempt to create the new reset record
            const createResult = await this.databaseService.createItem({
                id: reset.id, // Use the unique ID for the reset record
                collection: DatabaseCollectionEnums.PASSWORD_RESETS,
                itemDto: reset,
                organizationId: ''
            });

            if (!createResult) {
                throw new Error(`Failed to create password reset record for user ${userId}.`);
            }

            return createResult;

        } catch (error) {
            console.error(`Error in createPasswordReset for user ${userId}:`, error);
            throw new Error(`Unable to create password reset for user ${userId}: ${error.message}`);
        }
    }





    // async createPasswordReset(userId: string): Promise<PasswordResetInterface | null> {
    //     const expiryInterval = 60 * 60 * 1000; // 1 hour
    //     const expiryTimeInSeconds = Date.now() + expiryInterval;
    //     const expiresAt = new Date(expiryTimeInSeconds).toISOString();

    //     const remove = await this.databaseService.deleteItem({ id: userId, collection: DatabaseCollectionEnums.PASSWORD_RESETS, organizationId: '' });

    //     const reset: PasswordResetInterface = {
    //         id: userId,
    //         userId,
    //         expiresAt,
    //         token: generateUniqueId(),
    //         createdBy: userId,
    //         createdAt: new Date().toISOString(),
    //     }
    //     const create = await this.databaseService.createItem({ id: userId, collection: DatabaseCollectionEnums.PASSWORD_RESETS, itemDto: reset, organizationId: '' });
    //     return create;

    // }

    async validatePasswordUpdateToken(id: string): Promise<boolean> {
        const resets = await this.databaseService.getItemsByField({ field: 'token', value: id, collection: DatabaseCollectionEnums.PASSWORD_RESETS, organizationId: '' });
        const token = resets[0];
        if (!token) {
            return false;
        }
        const isValid = token.expiresAt >= new Date().toISOString();
        return isValid;
    }


    async updatePassword(data: DBRequestInterface): Promise<UserAuthenticationInterface> {
        const { organizationId, payload } = data;
        const { id, password } = payload;



        // Hash the password'

        const passwordResets = await this.databaseService.getItemsByField({ field: 'token', value: id, collection: DatabaseCollectionEnums.PASSWORD_RESETS, organizationId: '' });

        const passwordReset = passwordResets[0];


        // const passwordReset: PasswordResetInterface | null = await this.databaseService.updateItem({ id: id, collection: DatabaseCollectionEnums.CREDENTIALS, itemDto: { verified: true }, organizationId: '' });
        if (!passwordReset) {
            return { token: null, user: null };
        }
        const deleted = await this.databaseService.deleteItem({ id: passwordReset.id, collection: DatabaseCollectionEnums.PASSWORD_RESETS, organizationId: '' });
        const user = await this.databaseService.getItem({ id: passwordReset.userId, collection: DatabaseCollectionEnums.USERS, organizationId: '' });

        if (!user) {
            return { token: null, user: null };
        }
        const update = this.createUserCredentials({ userId: user.id, password });
        const token = await this.createAuthToken(user.id, "login");
        // Create the credential document

        return { token, user };
        // return { token: null, user: null };
    }




    // verifyEmail(email: string): Observable<UserVerificationInterface> {
    //     return new Observable<UserVerificationInterface>((subscriber) => {
    //       this.httpService.getByKey('email', email, 'users').pipe(take(1)).subscribe({
    //         next: (data) => {
    //           const user = data[0];

    //           let userFromDB: UserVerificationInterface = {
    //             status: 'NOT_INVITED',
    //             user,
    //           }

    //           // if user exists, check status
    //           if (user && !user.verified) {
    //             userFromDB.status = 'PENDING';
    //           }

    //           if (user && user.verified) {
    //             userFromDB.status = 'VERIFIED';
    //           }

    //           subscriber.next(userFromDB);

    //         },
    //         error: (err) => {
    //         },
    //       });
    //     })
    //   }

}