/* eslint-disable prettier/prettier */
export function primeNumberTheorem(
    primeFactor: number,
) {
    const naturalLog = Math.log(primeFactor);
    const fraction = primeFactor * naturalLog;
    return fraction;
}



