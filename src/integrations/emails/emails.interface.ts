/* eslint-disable prettier/prettier */

export interface EmailAttachmentInterface {
    filename: string, // Name of the file
    content: Buffer, // The Buffer containing the PDF data
    contentType: string, // MIME type for a PDF
}
export interface EmailInterface {
    id?: string,
    recipients: string[],
    subject: string,
    // body: string,
    html: string,
    text?: string,
    attachments: EmailAttachmentInterface[],
}