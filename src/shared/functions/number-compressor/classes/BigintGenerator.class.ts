/* eslint-disable prettier/prettier */
export class BigintGenerator {
    private readonly SEED = BigInt(987654321); // Fixed seed for deterministic output
    private readonly MODULUS = BigInt("1".padEnd(130, "0")); // Large modulus ~ 10^129
    private readonly MULTIPLIER = BigInt(6364136223846793005); // LCG constant
    private readonly INCREMENT = BigInt(1442695040888963407); // LCG increment

    generate(size: number, minDigits = 100, maxDigits = 128): string[] {
        if (size < 1 || size > 1_000_000) {
            throw new Error("Size must be between 1 and 1,000,000.");
        }

        const numbers: string[] = [];
        let seed = this.SEED;

        for (let i = 0; i < size; i++) {
            // Apply linear congruential generator (LCG) for repeatable pseudorandomness
            seed = (this.MULTIPLIER * seed + this.INCREMENT) % this.MODULUS;

            // Convert seed to a string and apply file-like patterns
            let numStr = seed.toString();

            // Mimic file-like BigInts: Introduce clusters and high-frequency digits
            if (i % 3 === 0) numStr = numStr.replace(/0/g, "9"); // Replace some 0s with 9s
            if (i % 5 === 0) numStr = numStr.replace(/1/g, "7"); // Replace some 1s with 7s
            if (i % 7 === 0) numStr = numStr.padEnd(maxDigits, "0"); // Simulate zero padding

            // Ensure it's between minDigits and maxDigits
            if (numStr.length > maxDigits) {
                numStr = numStr.slice(0, maxDigits);
            } else if (numStr.length < minDigits) {
                numStr = numStr.padStart(minDigits, "0");
            }

            numbers.push(numStr);
        }

        return numbers;
    }
}


