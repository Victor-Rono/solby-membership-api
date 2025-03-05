/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
    async generatePDFFromHTML(payload: { fileName: string; html: string }): Promise<{ fileName: string; pdfBuffer: Buffer }> {
        const { fileName, html } = payload;

        try {
            // Launch a headless browser using Playwright
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'load' });

            // Generate the PDF as a Buffer
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

            await browser.close();

            // Return the file name and buffer
            return { fileName, pdfBuffer };
        } catch (error) {
            console.error(error);
            throw new Error('Error generating PDF');
        }
    }
}