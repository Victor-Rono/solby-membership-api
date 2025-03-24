/* eslint-disable prettier/prettier */
import { MemberInterface, MemberStatusEnum } from "../interfaces/members.interface";
import { UserInterface } from "../interfaces/user.interface";

export function convertMemberToUser(payload: { organizationId: string, member: MemberInterface }): UserInterface {
    const { organizationId, member } = payload;
    // const user: MemberInterface = {
    //     id: member.id,
    //     name: member.name,
    //     email: member.email,
    //     username: member.email,
    //     phone: member.phone,
    //     idNumber: member.idNumber,
    //     photoURL: '',
    //     verified: false,
    //     deleted: false,
    //     permissions: [],
    //     organizations: [organizationId],
    //     admin: false,
    //     createdBy: member.createdBy,
    //     member: true,
    //     status: MemberStatusEnum.ACTIVE,
    // }
    const user: MemberInterface = member;
    user.organizations = [organizationId];
    user.admin = false;
    user.member = true;
    user.status = MemberStatusEnum.ACTIVE;
    user.permissions = [];
    user.verified = false;
    user.deleted = false;
    user.photoURL = '';
    return user;
}