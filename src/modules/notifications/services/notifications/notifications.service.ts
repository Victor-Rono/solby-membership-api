/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationDataInterface, NotificationMessageInterface, UserNotificationInterface } from 'src/shared/interfaces/notification.interface';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { sortArrayByKey } from 'victor-dev-toolbox';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { generateUniqueId } from 'src/database/database.functions';

const collection: DatabaseCollectionEnums = DatabaseCollectionEnums.NOTIFICATIONS;

@Injectable()
export class NotificationService extends BaseService<any, any, any, any> {
    constructor(
        // private arrayService: ArrayService,
    ) {
        super();
    }

    async sendNotificationToUserByEmail(organizationId: string, email: string, payload: NotificationDataInterface, options: { url?: string }): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const users: any = await this.databaseService.getItemsByField({ organizationId: '', field: 'email', value: email, collection: DatabaseCollectionEnums.USERS });
            const user = users[0];
            if (user) {
                this.sendNotification(organizationId, user, payload).then(res => {
                    resolve(res);
                })

            } else {
                throw new NotFoundException('User not found');
            }
        })
    }

    sendNotification(organizationId: string, user: UserInterface, payload: NotificationDataInterface) {
        return new Promise<any>((resolve, reject) => {
            this.getUserNotifications({ userId: user.id, organizationId }).then((notification: UserNotificationInterface | null) => {
                const message = this.prepareMessage(payload)
                if (!notification) {
                    const userNotification: UserNotificationInterface = {
                        id: user.id,
                        messages: [message],
                        createdBy: user.email,
                        createdAt: new Date().toISOString(),
                    };

                    this.databaseService.createItem({ organizationId, id: user.id, itemDto: userNotification, collection: this.collection }).then(res => {
                        resolve(res);
                    })

                } else {
                    // let currentMessage = notification.messages.find(m => m.id === )
                    this.updateNotifications(organizationId, user.id, [message]).then(res => {
                        resolve(res);
                    })
                    // resolve(true);
                }
            })
        })
    }


    updateNotifications(
        organizationId: string,
        userId: string,
        notifications: NotificationMessageInterface[],
        deleteNotifications?: 'deleteNotifications'
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!this.collection) {
                throw new Error('Error connectiong to DB');
            }

            this.getUserNotifications({ userId, organizationId }).then(res => {
                if (!res) {
                    throw new Error('Messages Not Found');
                }
                let finalNotifications: NotificationMessageInterface[] = [];
                notifications.forEach(notification => {
                    const filtered = res.messages.filter(m => m.id !== notification.id);
                    if (!deleteNotifications) {
                        filtered.push(notification);
                    }


                    finalNotifications = filtered;
                })
                this.setUserNotifications(organizationId, userId, finalNotifications).then(res => {
                    resolve(res);
                })

            });
        })
    }


    setUserNotifications(organizationId: string, userId: string, messages: NotificationMessageInterface[]) {
        return new Promise<any>((resolve, reject) => {
            const numberOfNotifications = 800;
            const sortedMessages = sortArrayByKey('createdAt', 'DESC', messages).slice(0, numberOfNotifications);
            this.databaseService.updateItem({ organizationId, id: userId, itemDto: { messages: sortedMessages }, collection }).then(res => {
                resolve(res)
            })
        })
    }




    private prepareMessage(data: NotificationDataInterface): NotificationMessageInterface {
        const { title, message, url, from, imageURL } = data;

        const newNotification: NotificationMessageInterface = {
            id: generateUniqueId(),
            title,
            message,
            url,
            from,
            createdAt: new Date().toISOString(),
            imageURL,
        };
        return newNotification;
    }


    createNotification(userId: string, notificationId: string, payload: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const collection = `notifications/${userId}` as DatabaseCollectionEnums;

        })
    }


    async notifyAdmins(organizationId: string, message: NotificationDataInterface) {
        return new Promise<any>(async (resolve, reject) => {
            const users = await this.databaseService.getItemsByField({ organizationId, field: 'admin', value: true, collection: DatabaseCollectionEnums.USERS });
            users.forEach(async (user: UserInterface) => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                await this.sendNotification(organizationId, user, message).then(res => {
                })
            });
            resolve(true);
        })
    }

    getUserNotifications(payload: { userId: string, organizationId: string }) {
        const { userId, organizationId } = payload;
        return this.databaseService.getItem({ organizationId, id: userId, collection });
    }
}
