/* eslint-disable prettier/prettier */
import { DivisibleRangeInterface, DivisibleRangeNumbersInterface } from "../interfaces/numbers.interface";

export function findAllNumbersDivisibleBySpecifiedDigit(
    data: DivisibleRangeNumbersInterface
) {
    const { startNumber, endNumber, numberToCalculate } = data;
    let currentNumber = startNumber;
    const allDivisibleNumbers: number[] = [];
    while (currentNumber <= endNumber) {
        if (startNumber % numberToCalculate === 0) {
            allDivisibleNumbers.push(startNumber);
        }
        currentNumber++;
    }
    const result: DivisibleRangeInterface = {
        numbersToUse: {
            startNumber,
            endNumber,
            numberToCalculate,
        },
        allDivisibleNumbers: allDivisibleNumbers,
    };
    return result;
}

export function testDivisibilityBySpecifiedDigit(data: DivisibleRangeNumbersInterface) {
    const { startNumber, endNumber, numberToCalculate } = data;
    // let currentNumber = startNumber;
    let result = false;

    const product = startNumber * numberToCalculate;
    const reversed = reverseNumbersAndAddZerosBetween(product);

    if (reversed % startNumber === 0) {
        result = true;
        return result;
    }
    return result;
}

function reverseNumbersAndAddZerosBetween(data: number) {
    const stringified = data.toString();
    const reversed = stringified.split(" ").reverse();
    let finalString = '';
    reversed.forEach((element) => {

        finalString += element + "0";
    });
    const result = Number(finalString.trim());
    return result;
}


export function toFixedDecimalPlaces(payload: { number: number, decimalPlaces?: number }): number {
    const { number, decimalPlaces } = payload;
    const result = Number(number.toFixed(decimalPlaces || 2));

    return result;

}