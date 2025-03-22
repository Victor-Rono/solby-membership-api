/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { MembersService } from 'src/modules/members/services/members/members.service';
import { SingleGroupInterface } from 'src/shared/interfaces/groups.interface';
import { MemberInterface } from 'src/shared/interfaces/members.interface';

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
        const members: MemberInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'groupId', value: id, collection: DatabaseCollectionEnums.MEMBERS });
        // const All = await this.membersService.getAll(organizationId);
        // const members = All.filter(m => m.groupId === id);

        const starts: SingleGroupInterface = {
            members,
            group,

            dashboard: {
                totalMembers: members.length,
                expectedContributions: 10000,
                totalContributions: 0,
                balance: 0,
            }
        }
        // 
        return starts;
    }
}
