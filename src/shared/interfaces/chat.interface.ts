/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface ChatParticipantsInterface {
    currentSender: string,
    recipient: string,
}

export interface ChatInterface extends RecordInterface {
    sender: string,
    recipient: string,
    senderName: string,
    recipientName: string,
    senderPhoto: string,
    recipientPhoto: string,
    companyName?: string,
    companyRole?: string,
    readOnly?: boolean,
}

export interface ChatDetailsInterface {
    chat: Partial<ChatInterface>,
    message: Partial<ChatMessageInterface>,
}

export interface ChatMessageInterface extends RecordInterface {
    chatId: string,
    sender: string,
    recipient: string,
    message: string,
    readAt: string,
}

