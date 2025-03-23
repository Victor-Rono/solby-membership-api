/* eslint-disable prettier/prettier */
import { BarChartInterface, PieChartInterface } from "./apex.interface";
import { RecordInterface } from "./record.interface";


export enum MemberStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface MemberInterface extends RecordInterface {
  userId: string,
  name: string,
  email: string,
  phone: string,
  idNumber: string,
  outstandingBalance?: number,
  savings?: number,
  // paymentInterval: PaymentIntervalEnum,
  currency: string,
  deductions?: string[],
  allowances?: string[],
  bankName?: string,
  bankBranch?: string,
  accountNumber: number,
  location?: string,
  bankId?: string,
  status: MemberStatusEnum,
  registered?: boolean,
  groupId: string,
  groupAdmin?: string[],

}



export interface MembersDashboardInterface {
  activeMembers: number,
  inactiveMembers: number,
  newMembersThisMonth: number,
  totalMembers: number,
  revenueThisMonth: number,
  // revenueCollectedBarChart: BarChartInterface,
  membershipPieChart: PieChartInterface,
  revenueToday: number,

}


export interface MemberAccountInterface extends RecordInterface {
  // memberId: string,s
  amount: number,
}