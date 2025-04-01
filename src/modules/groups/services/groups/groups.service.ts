/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/services/base/base.service';
import { InvoiceInterface } from 'src/modules/invoices/invoices.interface';
import { MembersService } from 'src/modules/members/services/members/members.service';
import { totalForAllInvoices } from 'src/shared/functions/invoices.functions';
import { GroupDashboardInterface, GroupInterface, SingleGroupInterface } from 'src/shared/interfaces/groups.interface';
import { MemberAccountInterface, MemberInterface } from 'src/shared/interfaces/members.interface';
import { getFieldValuesFromArray } from 'victor-dev-toolbox';

@Injectable()
export class GroupsService extends BaseService<any, any, any, any> {
    constructor(
        private membersService: MembersService,

    ) {
        super();
    }

    override async getAll(organizationId: string): Promise<any[]> {
        const groups = await super.getAll(organizationId);
        return this.countGroupMembers({ groups, organizationId });

    }

    async getGroupStats(request: DBRequestInterface): Promise<SingleGroupInterface | null> {
        const { organizationId, id } = request;
        const group = await this.getById(request);
        if (!group) return null;
        const members: MemberInterface[] = await this.membersService.getByField({ organizationId, payload: { field: 'groupId', value: id } });
        // const All = await this.membersService.getAll(organizationId);
        // const members = All.filter(m => m.groupId === id);
        const dashboard = await this.getGroupDashboard(organizationId, id);
        const starts: SingleGroupInterface = {
            members,
            group,
            dashboard
        }
        // 
        return starts;
    }

    async getGroupDashboard(organizationId: string, groupId: string): Promise<GroupDashboardInterface> {
        const members: MemberInterface[] = await this.membersService.getByField({ organizationId, payload: { field: 'groupId', value: groupId } });

        const query = {
            $expr: {
                $and: [
                    { $gt: ["$totalAmount", "$amountPaid"] },
                    { $eq: ["$sellerId", organizationId] },
                    // { $eq: ["$buyerId", id] }
                ]
            }
        };
        const invoices: InvoiceInterface[] = await this.databaseService.getAllItems({ organizationId, query, collection: DatabaseCollectionEnums.INVOICES });
        const groupMemberIds = getFieldValuesFromArray('id', members);
        const filteredInvoices = invoices.filter(i => groupMemberIds.includes(i.buyerId));
        const totals = totalForAllInvoices(filteredInvoices);
        return {
            expectedContributions: totals.totalAmount,
            totalContributions: totals.amountPaid,
            balance: totals.totalDue,
            totalMembers: members.length,
        }

    }

    async makeAdmin(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { memberId, groupId } = payload;
        const member: MemberInterface = await this.membersService.getById({ id: memberId, organizationId });
        if (!member) throw new Error("Member Not Found");
        const adminGroups = member.adminGroups || [];
        adminGroups.push(groupId);
        return this.membersService.update({ id: memberId, payload: { adminGroups }, organizationId })
    }

    async removeAdmin(request: DBRequestInterface) {
        const { organizationId, payload } = request;
        const { memberId, groupId } = payload;
        const member: MemberInterface = await this.membersService.getById({ id: memberId, organizationId });
        if (!member) throw new Error("Member Not Found");
        const adminGroups = member.adminGroups || [];
        const filtered = adminGroups.filter(g => g !== groupId);
        return this.membersService.update({ id: memberId, payload: { adminGroups: filtered }, organizationId })
    }

    private async countGroupMembers(payload: { groups: GroupInterface[], organizationId: string }) {
        const { groups, organizationId } = payload;
        const allGroups: GroupInterface[] = [];
        let members: MemberInterface[] = [];
        if (!groups.length) return allGroups;
        if (groups.length === 1) {
            const group = groups[0];
            members = await this.membersService.getByField({ organizationId, payload: { field: 'groupId', value: group.id } });
            group.members = members.length;
            allGroups.push(group);
        } else {
            const members: MemberInterface[] = await this.membersService.getAll(organizationId);
            groups.forEach(g => {
                const filtered = members.filter(m => m.groupId === g.id);
                g.members = filtered.length;
                allGroups.push(g);
            })
        }
        return allGroups;
    }




}
