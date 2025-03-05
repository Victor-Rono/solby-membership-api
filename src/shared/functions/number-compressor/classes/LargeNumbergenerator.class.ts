/* eslint-disable prettier/prettier */
export class LargeNumberGenerator {
    private readonly SEED = BigInt(123456789); // Fixed seed for consistency
    private readonly MODULUS = BigInt("1".padEnd(129, "0")); // Large number close to 10^128
    private readonly MULTIPLIER = BigInt(48271); // LCG multiplier
    private readonly INCREMENT = BigInt(0); // Optional increment for LCG

    public generate(size: number): string[] {
        if (size < 1 || size > 1_000_000) {
            throw new Error("Size must be between 1 and 1,000,000.");
        }

        const numbers: string[] = [];
        let seed = this.SEED;

        for (let i = 0; i < size; i++) {
            seed = (this.MULTIPLIER * seed + this.INCREMENT) % this.MODULUS;
            let numStr = seed.toString().padStart(100, "0"); // Ensure minimum 100 digits
            if (numStr.length > 128) numStr = numStr.slice(0, 128); // Trim if exceeding 128 digits
            numbers.push(numStr);
        }

        return numbers;
    }
}


