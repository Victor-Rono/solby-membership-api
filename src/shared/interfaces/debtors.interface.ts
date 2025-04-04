/* eslint-disable prettier/prettier */

import { MemberInterface } from "./members.interface";
import { PaymentIntervalEnum, PaymentMethodsEnum } from "./payment.interface";
import { RecordInterface } from "./record.interface";




// export interface DebtorInterface extends RecordInterface {
//   userId: string,
//   name: string,
//   email: string,
//   phone: string,
//   idNumber: string,
//   balance?: number,
//   paymentMethod: PaymentMethodsEnum,
//   paymentInterval: PaymentIntervalEnum,
//   currency: string,
//   deductions?: string[],
//   allowances?: string[],
//   bankName?: string,
//   bankBranch?: string,
//   accountNumber: number,
// }

export interface DebtorInterface extends MemberInterface {
  name: string,

}
