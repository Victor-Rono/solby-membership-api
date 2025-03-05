/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface NotificationInterface {
  title: string;
  message: string;
}

export interface UserNotificationInterface extends RecordInterface {
  messages: NotificationMessageInterface[];
}

export type NotificationTypes = 'success' | 'error' | 'info' | 'warning';
export interface NotificationMessageInterface {
  id: string;
  title: string;
  message: string;
  from: string;
  url?: string;
  imageURL: string;
  createdAt: string;
  readAt?: string;
  type?: NotificationTypes;
  chat?: boolean;
}

export interface NotificationDataInterface {
  title: string;
  message: string;
  url: string;
  from: string;
  imageURL: string;
  type?: NotificationTypes;
}
