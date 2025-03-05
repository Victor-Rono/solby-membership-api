/* eslint-disable prettier/prettier */

export interface DivisibleRangeNumbersInterface {
    startNumber: number;
    endNumber: number;
    numberToCalculate: number;
}


export interface DivisibleRangeInterface {
    numbersToUse: DivisibleRangeNumbersInterface,
    allDivisibleNumbers: number[];
}
