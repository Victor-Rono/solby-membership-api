/* eslint-disable prettier/prettier */
import { BigintGenerator } from "./classes/BigintGenerator.class";
import { NumberGeneratorService } from "./services/number-generator.service";

class NumberCompressor {
    private numbergenService = new NumberGeneratorService();
    private bigintGenerator = new BigintGenerator();

    public run() {
        // return this.generateBigint();
        return this.gerNumbersArray();
    }

    private generateBigint() {
        const number = this.numbergenService.generateRandomNumber(8192);
        // const bigint = BigInt(number)
        return number;
    }

    private gerNumbersArray() {
        // const nums = this.numbergenService.getNumbersArray();
        const bigint = this.generateBigint();

        const nums = this.bigintGenerator.generate(10000);
        const check = this.checkBigintForSubsrtings(bigint, nums);
        return check;
    }

    private checkBigintForSubsrtings(bigint: string, substrings: string[]) {
        for (const substring of substrings) {
            if (bigint.toString().includes(substring)) {
                return true;
            }
        }
        return false;
    }
}

export function compressNumber() {
    const compressor = new NumberCompressor();
    return compressor.run();

}