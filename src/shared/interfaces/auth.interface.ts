/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignupInterface extends RecordInterface {
  name: string;
  email: string;
  phone: string;
  password: string;
  // roles?: UserRoleTypes[];
}
export interface ResetPasswordInterface {
  email: string;
}
