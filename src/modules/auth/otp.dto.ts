/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface OTPInterface extends RecordInterface {
    otp: string,
    expiryDate: number,
}
