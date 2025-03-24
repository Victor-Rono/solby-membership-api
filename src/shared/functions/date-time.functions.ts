/* eslint-disable prettier/prettier */
import { getEnumValues, TimeGroupEnum } from "victor-dev-toolbox";
import { DateRangeInterface } from "../interfaces/dates.interface";

export function getStartOfDay(date?: string | Date): string {
    const currentDate = date ? new Date(date) : new Date();
    currentDate.setHours(0, 0, 0, 0); // Mutates the currentDate object to the start of the day
    return currentDate.toISOString();
}

export function getEndOfDay(date?: string | Date): string {
    const currentDate = date ? new Date(date) : new Date();
    currentDate.setHours(23, 59, 59, 999); // Mutates the currentDate object to the end of the day
    return currentDate.toISOString();
}

export function getFullDateRange(date: DateRangeInterface): DateRangeInterface {
    const start = new Date(date.startDate || new Date().setFullYear(2000, 1, 1)).toISOString();
    const futureTime = new Date(new Date().getTime() + 100 * (365 * 24 * 60 * 60 * 1000)).toISOString();

    const startDate = getStartOfDay(date.startDate || start);
    const stopDate = getEndOfDay(date.stopDate || futureTime);
    return { startDate, stopDate }

}

export function getAllDaysWithinDateRange(dateRange: DateRangeInterface): string[] {
    const { startDate, stopDate } = dateRange;
    const allDates: string[] = [];

    // If neither startDate nor stopDate is defined, return an empty array
    if (!startDate && !stopDate) {
        return allDates;
    }

    // Parse startDate and stopDate to ensure they are valid dates
    const startDateObj = startDate ? new Date(startDate) : null;
    const stopDateObj = stopDate ? new Date(stopDate) : null;

    // If only startDate is defined, return that single day
    if (startDate && !stopDate) {
        startDateObj!.setHours(0, 0, 0, 0);
        allDates.push(startDateObj!.toISOString().split('T')[0]);
        return allDates;
    }

    // If only stopDate is defined, return that single day
    if (!startDate && stopDate) {
        stopDateObj!.setHours(0, 0, 0, 0);
        allDates.push(stopDateObj!.toISOString().split('T')[0]);
        return allDates;
    }

    // If both startDate and stopDate are defined, get all days within the range
    if (startDate && stopDate) {
        const currentDate = new Date(startDateObj!.setHours(0, 0, 0, 0));
        const endDate = new Date(stopDateObj!.setHours(0, 0, 0, 0));

        // Ensure startDate is before or equal to stopDate
        if (currentDate > endDate) {
            return allDates; // Return an empty array if the range is invalid
        }

        while (currentDate <= endDate) {
            allDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
    }

    return allDates;
}


/**
 * Converts a TimeGroupEnum enum value to a field name.
 *
 * @param timeGroup - The TimeGroupEnum enum value to convert.
 * @returns The corresponding field name as a string.
 */
export function getfieldFromTimeGroup(timeGroup: TimeGroupEnum) {
    switch (timeGroup) {
        case 'MID-DAY':
            return 'midDay';
            break;

        default:
            return timeGroup.toLocaleLowerCase();
            break;
    }
}

export function getAllTimeGroups() {
    const timesOfDay: string[] = [];
    const timeGroups: TimeGroupEnum[] = getEnumValues(TimeGroupEnum);
    timeGroups.forEach(t => {
        const timeGroup = getfieldFromTimeGroup(t);
        timesOfDay.push(timeGroup);
    })
    return timesOfDay;
}



export function getBeginningOfEachDayFromArrayOfDates(dates: string[]) {
    const beginningOfEachDay: string[] = [];
    dates.forEach(date => {
        const beginingOfDay = getBeginningOfDayFromDate(date);
        if (!beginningOfEachDay.includes(beginingOfDay)) {
            beginningOfEachDay.push(beginingOfDay);
        }
    });
    return beginningOfEachDay.sort();
}

export function getBeginningOfDayFromDate(siku?: string) {
    const date = siku || new Date().toISOString();
    const beginningOfDay = new Date(date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999);
    const timeNow = new Date(date).getTime();
    // const isWithinToday = timeNow >= beginningOfDay && timeNow <= endOfDay;
    const beginning = new Date(beginningOfDay).toISOString();
    return beginning;
}

export function getEndOfDayFromDate(date: string) {
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999);
    const end = new Date(endOfDay).toISOString();
    return end;
}



export function convertToDDMMYYYY(current?: string): string {
    let date: Date;

    if (current) {
        // Assume input is in MM/DD/YYYY format and parse it correctly
        const [month, day, year] = current.split('/').map(Number);
        date = new Date(year, month - 1, day);
    } else {
        // Use the current date
        date = new Date();
    }

    // Format the date as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}




