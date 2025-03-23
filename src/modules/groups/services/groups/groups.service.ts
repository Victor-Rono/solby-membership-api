/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { InvoiceInterface } from 'src/modules/invoices/invoices.interface';
import { MembersService } from 'src/modules/members/services/members/members.service';
import { totalForAllInvoices } from 'src/shared/functions/invoices.functions';
import { GroupDashboardInterface, SingleGroupInterface } from 'src/shared/interfaces/groups.interface';
import { MemberAccountInterface, MemberInterface } from 'src/shared/interfaces/members.interface';
import { getFieldValuesFromArray } from 'victor-dev-toolbox';

@Injectable()
export class GroupsService extends BaseService<any, any, any, any> {
    constructor(
        private membersService: MembersService,

    ) {
        super();
    }

    async getGroupStats(request: DBRequestInterface): Promise<SingleGroupInterface | null> {
        const { organizationId, id } = request;
        const group = await this.getById(request);
        if (!group) return null;
        // const members: MemberInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'groupId', value: id, collection: DatabaseCollectionEnums.MEMBERS });
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
        const members: MemberInterface[] = await this.databaseService.getItemsByField({ organizationId, collection: DatabaseCollectionEnums.MEMBERS, field: 'groupId', value: groupId });
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


}
