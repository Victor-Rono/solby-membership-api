/* eslint-disable prettier/prettier */
import { InvoiceCalculationInterface, InvoiceInterface } from "src/modules/invoices/invoices.interface";
import { BarChartInterface, PieChartInterface } from "./apex.interface";
import { RecordInterface } from "./record.interface";
import { UserInterface } from "./user.interface";
import { GroupInterface } from "./groups.interface";


export enum MemberStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface MemberInterface extends UserInterface {
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
  adminGroups?: string[],
  verified?: boolean,

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

export interface MembershipDashboardInterface {
  member: MemberInterface,
  account: MemberAccountInterface,
  pendingInvoices: InvoiceInterface[],
  invoiceTotals: InvoiceCalculationInterface,
  adminGroups: GroupInterface[],
  group: GroupInterface,
}