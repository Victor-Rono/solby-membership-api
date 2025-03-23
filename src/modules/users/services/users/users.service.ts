/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { log } from "console";
import { cloneDeep } from "lodash";
import { DatabaseCollectionEnums, DBRequestInterface } from "src/database/database.interface";
import { BaseService } from "src/modules/base/base.service";
import { CreatePermissionFromEnums } from "src/modules/permissions/permissions.functions";
import { resolveMultiplePromises } from "src/shared/functions/promises.functions";
import { PermissionEnums, PermissionInterface } from "src/shared/interfaces/permission.interface";
import { UserInterface, UserRoleType } from "src/shared/interfaces/user.interface";
import { generateUniqueId } from "victor-dev-toolbox";
import { UserEventsEnum } from "../users-automation/user-events.enum";



@Injectable()
export class UsersService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.USERS;
    constructor() {
        super();
    }

    // override async getAll(organizationId: string) {
    //     return [];
    // }

    async getOrgUsers(payload: { organizationId: string }) {
        const { organizationId } = payload;
        const users = await this.getAll(organizationId);

        const orgUsers: UserInterface[] = [];

        users.forEach((user: UserInterface) => {
            const organizations = user.organizations || [];
            if (organizations.includes(organizationId) && !user.member) {
                orgUsers.push(user);
            }
        });
        return orgUsers;
        // return this.databaseService.getItemsByField({ organizationId, field: { field: 'organizations', value: organizationId } });
    }


    async registerUser(payload: { id?: string, user: UserInterface, organizationId: string, permissions: PermissionEnums[] }) {

        const { user, organizationId, permissions } = payload;

        const verify = await this.verifyUser(user);

        if (!verify) {
            throw new Error("User Unverified");
        }

        let result: any = false;

        const email = user.email;
        if (!email) {
            throw new Error("Email is required");
        }
        const AllUsers: UserInterface[] = await this.getByField({ organizationId, payload: { field: 'email', value: user.email } });
        const userInDB = AllUsers[0];
        if (userInDB) {

            const userOrgs = userInDB.organizations || [];

            if (!userOrgs.includes(organizationId)) {
                if (!user.organizations) {
                    user.organizations = userOrgs || [];
                }
                user?.organizations.push(organizationId);
            }
            // delete (user.id);
            user.id = userInDB.id;


            // const update = await this.update({
            //     id: userInDB.id, payload: user, organizationId
            // });
            const update = await this.databaseService.updateItem({ id: user.id, itemDto: user, organizationId: "", collection: DatabaseCollectionEnums.USERS });
            // Send An Email to the User
            this.eventEmitter.emit(UserEventsEnum.USER_INVITED_TO_ORGANIZATION, { userId: userInDB.id, organizationId });
            result = update;

        } else {
            const id = user.id || generateUniqueId();
            user.organizations = [organizationId];
            const createUser = await this.create({ organizationId, payload: user });
            result = createUser;
            // Send An Email to the User
            this.eventEmitter.emit(UserEventsEnum.USER_INVITED_TO_ORGANIZATION, { userId: id, organizationId });
        }
        if (result?.id) {
            const createdPermissions = CreatePermissionFromEnums({ id: result.id, permissionEnums: permissions });

            const savePermissions = await this.savePermissions({ userId: result.id, permissions: createdPermissions, organizationId });

        }

        return result;
    }

    private async verifyUser(user: UserInterface): Promise<boolean> {
        return true;
    }

    async updateUser(payload: { id: string, user: Partial<UserInterface>, organizationId: string, permissions: PermissionEnums[] }) {
        const { user, organizationId, permissions } = payload;
        const createdPermissions = CreatePermissionFromEnums({ id: user.id, permissionEnums: permissions });

        const updateUser = await this.update({ id: payload.id, payload: user, organizationId });
        const updatePermissions = await this.savePermissions({ userId: payload.id, permissions: createdPermissions, organizationId });
        return updatePermissions;
    }

    async savePermissions(payload: { userId: string, permissions: PermissionInterface[], organizationId: string }) {
        const permissionsCollection = DatabaseCollectionEnums.PERMISSIONS;
        const { userId, permissions, organizationId } = payload;
        const modifiedPermissions: PermissionInterface[] = [];


        permissions.forEach((permission: PermissionInterface) => {
            const clone = cloneDeep(permission);

            clone.userId = userId;
            modifiedPermissions.push(clone);
        });

        const currentPermission = await this.databaseService.getItem({ id: userId, organizationId, collection: permissionsCollection });

        if (currentPermission) {
            const DBPermissions = currentPermission.permissions || [];
            const combined = permissions;
            const reduced = this.removeDuplicatePermissions(combined);
            const update = await this.databaseService.updateItem({ id: userId, itemDto: { permissions: reduced }, collection: permissionsCollection, organizationId });

            return update;
        } else {
            const create = await this.databaseService.createItem({
                id: userId, itemDto: { permissions: modifiedPermissions }, collection: permissionsCollection, organizationId
            });

            return create;

        }


    }


    private removeDuplicatePermissions(permissions: PermissionInterface[]) {
        const reduced: PermissionInterface[] = [];
        permissions.forEach(p => {
            if (!reduced.includes(p)) {
                reduced.push(p);
            }
        });
        return reduced;
    }


    handleUserRegistration(payload: { role: UserRoleType, organizationId: string, user: UserInterface }) {
        const { user, organizationId } = payload;
        const userId = generateUniqueId();
        const userData = {
            id: userId,
            ...user
        };
        const userPermissions = {
            userId,
        };

        // switch (payload.role) {
        //     case 'farmer'

        //     d
        //     break;
        // }

    }

    async deleteUser(payload: { userId: string, organizationId: string }) {
        const { userId, organizationId } = payload;
        // return this.databaseService.deleteItem({ id: userId, collection: this.collection, organizationId });
        const user: UserInterface | null = await this.getById({ id: userId, organizationId });
        if (!user) throw new Error("User Not Found");
        const orgs = user.organizations || [];
        const filtered = orgs.filter(org => org !== organizationId);
        const removeUserFromOrg = await this.update({ id: userId, payload: { organizations: filtered }, organizationId });
        const deletePermissions = await this.databaseService.deleteItem({ id: userId, collection: DatabaseCollectionEnums.PERMISSIONS, organizationId });
        return removeUserFromOrg;
    }

    async getUserByEmail(email: string): Promise<UserInterface | null> {
        const users: UserInterface[] = await this.getByField({ payload: { field: 'email', value: email }, organizationId: '' });
        const user = users[0] || null;
        return user;
    }

    async getUserPermissions(payload: DBRequestInterface) {
        const { id, organizationId } = payload;
        const permissionInDB = await this.databaseService.getItem({ id, collection: DatabaseCollectionEnums.PERMISSIONS, organizationId });
        const permissions = permissionInDB?.permissions || [];
        return permissions;

    }

    async updateAllUserIds() {
        const organizationId = '11111111';
        const usersInDb = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.USERS, organizationId });
        const users: any[] = [];
        usersInDb.forEach(u => {
            const find = users.find(user => user.id === u.id);
            if (find) {

            }
            if (find) return;
            u._id = u.id;
            users.push(u);
        });
        const backup = await this.backupUsers(users, organizationId);
        // let promises: any[] = [];
    }

    private async backupUsers(users: any[], organizationId: string) {
        const clearCollection = await this.databaseService.deleteCollection({ collection: DatabaseCollectionEnums.USERS_BACKUP, organizationId });

        users.forEach(async (u) => {
            const create = await this.databaseService.createItem({
                id: u.id,
                itemDto: u,
                collection: DatabaseCollectionEnums.USERS_BACKUP,
                organizationId
            });

        });

        const backups = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.USERS_BACKUP, organizationId });

        // const clearUsers = await this.databaseService.deleteCollection({ collection: DatabaseCollectionEnums.USERS, organizationId });

        // users.forEach(async (u) => {
        //     const create = await this.databaseService.createItem({
        //         id: u.id,
        //         itemDto: u,
        //         collection: DatabaseCollectionEnums.USERS,
        //         organizationId
        //     });
        // });

        return backups;
    }

    private async createUser(user: any) {
        const organizationId = '11111111';
        const id = user.id;
        user._id = id;
        const backup = await this.deleteCurrent(user);
        const create = await this.create({ organizationId, id: user.id, payload: user });

        return create;
    }

    private async deleteCurrent(user: UserInterface) {
        const organizationId = '11111111';
        const id = user.id;
        const deleteUser = await this.databaseService.deleteItem({ id, collection: DatabaseCollectionEnums.USERS, organizationId });
        const backup = await this.databaseService.deleteItem({ id, collection: DatabaseCollectionEnums.USERS_BACKUP, organizationId });
        const create = await this.databaseService.createItem({ id, itemDto: user, collection: DatabaseCollectionEnums.USERS_BACKUP, organizationId });
        return deleteUser;

    }
    // }

}
