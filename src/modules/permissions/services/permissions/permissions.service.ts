/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { getFieldValuesFromArray } from 'victor-dev-toolbox';
import { PermissionInterface } from 'src/shared/interfaces/permission.interface';

@Injectable()
export class PermissionsService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.PERMISSIONS;

    async transferPermissions(request: DBRequestInterface) {
        const { payload, organizationId } = request;
        const { userWithPermissions, userWithoutPermissions } = payload;
        const permissionsCollection = DatabaseCollectionEnums.PERMISSIONS;
        const organizations = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const ids = getFieldValuesFromArray('id', organizations);


        ids.forEach(async (orgId) => {
            // const permissionsFromDB = await this.databaseService.getItem({ id: userWithPermissions, organizationId, collection: permissionsCollection });
            const permissionsFromDB = await this.getById({ id: userWithPermissions, organizationId });
            const permissions: PermissionInterface[] = permissionsFromDB?.permissions || [];
            if (!permissions.length) {
                return;
            }
            const modifiedPermissions = [];

            permissions.forEach(p => {
                p.userId = userWithoutPermissions;
                modifiedPermissions.push(p);
            });

            const create = await this.databaseService.createItem({ id: userWithoutPermissions, itemDto: { permissions: modifiedPermissions }, organizationId: orgId, collection: permissionsCollection });
        });
    }

}
