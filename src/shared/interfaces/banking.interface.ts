/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

export type BankAccountTypes = 'PEDEA' | 'fuel-depot' | 'e-commerce';
export interface BankAccountInterface extends RecordInterface {
  country: string;
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  ownerId: string;
  type: BankAccountTypes;
  businessId?: string;
  swiftCode?: string;
  city?: string;
}

export interface AccountOwnerInterface {
  name: string;
  imageURL: string;
  redirectURL: string;
}
