/* eslint-disable prettier/prettier */
import * as XLSX from 'xlsx';
import * as fs from 'fs';

/**
 * Reads an Excel file and returns its contents as an array of objects.
 *
 * @param {string} [path] - The path to the Excel file to read. If not provided, it defaults to './assets/xlxs/main.xlsx'.
 * @returns {Promise<any[]>} - A promise that resolves to an array of objects, where each object represents a row in the Excel file.
 */
export function readExcel(path?: string): Promise<any[]> {
    const filePath = path || './assets/xlxs/main.xlsx';
    return new Promise<any[]>((resolve, reject) => {
        const items: any[] = [];
        const fileContent = fs.readFileSync(filePath);

        // Read workbook and ensure dates are handled correctly
        const workbook = XLSX.read(fileContent, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        // Extract headers while skipping undefined or null values
        const headers = Object.keys(data[0]).filter((header) => data[0][header] !== undefined && data[0][header] !== null);

        for (const row of data) {
            const rowDataObject = {};

            headers.forEach((header) => {
                let value = row[header];

                // Check if value is a date and convert to desired format if needed
                if (value instanceof Date) {
                    // You can format the date here, e.g., using toISOString(), or a custom format
                    value = value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                }

                // rowDataObject[header.trim().toString()] = value || 'undefined';
                rowDataObject[header.trim().toString()] = value;
            });

            items.push(rowDataObject);
        }

        resolve(items);
    });
}




export function correctInvalidDates(data: any[], fieldsToCheck: string[]) {
    // .replace(/-/g, '/')
    const validDates: any[] = [];

    data.forEach((item) => {
        const validItem = correctDateForItem(item, fieldsToCheck);
        validDates.push(validItem);
    })
    return validDates;
}

function correctDateForItem(data: any, fieldsToCheck: string[]) {
    fieldsToCheck.forEach((field) => {

        const item = data[field];
        if (item) {
            const correctDate = item.replace(/-/g, '/');
            data[field] = correctDate;
        };
    });
    return data;
}