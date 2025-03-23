/* eslint-disable prettier/prettier */
// import { AddressInterface } from "../locations/addres.interface";
// import { BadgeInterface } from "./badge.interface";
// import { SocialMediaInterface } from "./social-media.interface";

import { RecordInterface } from './record.interface';
import { CountryInterface } from './countries.interface';
import { PermissionInterface } from './permission.interface';

export interface UserRolesInterface {
  admin?: boolean;
  agent?: boolean;
  accountant?: boolean;
}

export type UserRoleType = 'creditor' | 'debtor' | 'employee' | 'transporter' | 'farmer' | 'Agrovet';
export interface UserInterface extends RecordInterface {
  name: string,
  email: string,
  username: string,
  phone: string,
  idNumber: string,
  photoURL?: string,
  verified?: boolean,
  deleted?: boolean,
  permissions?: PermissionInterface[],
  organizations?: string[],
  admin?: boolean,
  creditor?: boolean,
  debtor?: boolean,
  member?: boolean,
}

export interface UserRegistrationInterface {
  name: string,
  email: string,
  phone: string,
  idNumber: string,
}
export type UserVerificationTypes = 'PENDING' | 'NOT_INVITED' | 'VERIFIED';


export interface UserVerificationInterface {
  status: UserVerificationTypes,
  user: UserInterface | null;
}

export interface UserAuthenticationInterface {
  user: UserInterface | null;
  token: string | null;
}

export interface PasswordResetInterface extends RecordInterface {
  userId: string;
  token: string;
  expiresAt: string;

}

