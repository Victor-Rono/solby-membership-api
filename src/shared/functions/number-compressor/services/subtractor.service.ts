/* eslint-disable prettier/prettier */
import { NumberGeneratorService } from "./number-generator.service";

export class SubtractorService {
    private numbergenerator = new NumberGeneratorService();
    private getOnesToMatch(int: bigint) {
        const length = int.toString().length;
        const ones = this.numbergenerator.generateRandomNumber(length, '1');
        return ones;

    }
}