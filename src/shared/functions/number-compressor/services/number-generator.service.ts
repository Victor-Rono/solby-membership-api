/* eslint-disable prettier/prettier */
import { LargeNumberGenerator } from "../classes/LargeNumbergenerator.class";

export class NumberGeneratorService {
    private numbers = "0123456789";
    private largeNumGen = new LargeNumberGenerator();

    public generateRandomNumber(length: number, numberSet?: string) {
        // if (!numberSet.length) {
        //     throw new Error("");

        // }
        let finalNumber = '';
        const numbersArray: string[] = (numberSet || this.numbers).split('');
        let count = 0;
        while (count < length) {
            const random = Number(Math.floor(Math.random() * (numbersArray.length)));
            const selected = numbersArray[random]
            finalNumber += selected;

            count++;
        }
        return finalNumber;
    }

    public getNumbersArray() {
        return this.largeNumGen.generate(10);
    }
}