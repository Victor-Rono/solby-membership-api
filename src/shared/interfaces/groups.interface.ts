/* eslint-disable prettier/prettier */
import { MemberInterface } from "./members.interface";
import { RecordInterface } from "./record.interface";

export interface GroupInterface extends RecordInterface {
    name: string,
    description: string,
}

export interface SingleGroupInterface {
    group: GroupInterface,
    members: MemberInterface[];
    dashboard: GroupDashboardInterface
}

export interface GroupDashboardInterface {
    totalMembers: number,
    expectedContributions: number,
    totalContributions: number,
    balance: number,

}