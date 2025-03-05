/* eslint-disable prettier/prettier */
import { PermissionInterface } from 'src/shared/interfaces/permission.interface';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { getEnumValues, getFieldValuesFromArray, getXDaysFromTomorrow, uniqueArrayItems } from 'victor-dev-toolbox';
import { PermissionAccessEnum, PermissionEnums } from 'src/shared/interfaces/permission.interface';
import { createPermission, createUserPermission } from 'src/shared/functions/permissions.functions';
import { CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { PermissionsService } from 'src/modules/permissions/services/permissions/permissions.service';
import { cloneDeep } from 'lodash';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';
import { ProductInterface } from 'src/shared/interfaces/product.interface';
import { UnitEnums } from 'src/shared/enums/units.enums';
import { AccountingEnum, AccountInterface } from 'src/modules/accounting/accounting.interface';
import { prepareAccount } from 'src/shared/functions/accounting.functions';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { ownerPermissions, emailsToRegisterToEveryOrganization } from '../../data/tenants.data';
import { TenantInterface, TenantRegistrationInterface } from '../../interfaces/tenants.interface';
import { DefaultProducts } from '../../data/default-products.data';

@Injectable()
export class TenantsService extends BaseService<any, any, any, any> {
    constructor(
        private usersService: UsersService,
        private permissionsService: PermissionsService,
        // private smsService: SmsService,
    ) {
        super();
    }


    //*********** CREATING A NEW ORGANIZATION *************

    /**
     * Creates a new organization and its associated users.
    *
    * @param itemDto - The request data containing the organization and user details.
    * @returns The registered organization users.
    */
    override async create(itemDto: CreateRequestInterface) {
        // Create Organization
        const organization = await this.createOrganization(itemDto);

        // Create Organization Users
        const organizationUsers = await this.createOrganizationUsers(organization.id, itemDto);
        this.addResources(organization.id);

        return organization;
    }

    override async getAll(organizationId: string): Promise<any[]> {
        const orgs = await super.getAll(organizationId);
        const filtered = orgs.map(o => {
            delete o.password
            return o;
        });
        return filtered;
    }

    async getUserOrgs(payload: DBRequestInterface) {
        const { organizationId, id } = payload;


        const promises: any[] = [
            this.databaseService.getItem({ id, organizationId, collection: DatabaseCollectionEnums.USERS }),
            this.getAll(organizationId)
        ]
        const resolved = await resolveMultiplePromises(promises);
        const user: UserInterface = resolved[0];
        if (!user) return [];
        const orgs: TenantInterface[] = resolved[1];
        const filtered = orgs.filter(o => user.organizations.includes(o.id));
        return filtered;
    }

    private async createOrganizationUsers(currentOrganizationId: string, itemDto: CreateRequestInterface) {
        const organizationOwner = this.filterTenantFields(itemDto.payload, 'Owner');
        const registerUsers = await this.registerUsersToOrganization({
            organizationOwner,
            currentOrganizationId,
        });

        return registerUsers;

    }

    private addResources(organizationId: string) {
        this.addProducts(organizationId);
        this.AddAccounts(organizationId);
    }


    private async createOrganization(itemDto: CreateRequestInterface): Promise<OrganizationInterface> {
        const organizationData = this.filterTenantFields(itemDto.payload, 'Organization');

        const orgtDTO = cloneDeep(itemDto);
        orgtDTO.payload = organizationData;
        const organization = await super.create(orgtDTO);
        return organization;
    }


    private async registerUsersToOrganization(payload: { organizationOwner: Partial<TenantInterface>, currentOrganizationId: string }) {
        const { organizationOwner, currentOrganizationId } = payload;

        const userDetails = organizationOwner as any;

        const partialUser: Partial<UserInterface> = {
            email: userDetails.ownerEmail,
            phone: userDetails.ownerPhone,
            name: userDetails.ownerName,
            username: userDetails.ownerEmail,
            idNumber: userDetails.ownerIdNumber,
            admin: true,
        };

        const user = partialUser as any as UserInterface;

        const saveUser = await this.usersService.registerUser({
            user,
            organizationId: currentOrganizationId,
            permissions: [],
        });

        // assign the owner permissions
        const permissions = this.createPermissions({ organizationId: currentOrganizationId, userId: saveUser.id, permissions: ownerPermissions, accessType: PermissionAccessEnum.FULLACCESS });

        // save owner Permissions
        const saveOwnerPermissions = await this.permissionsService.create({
            organizationId: currentOrganizationId,
            id: user.id,
            payload: {
                permissions,
            },
        });

        // add default users and permissions
        this.addDefaultOrganizationUsers(currentOrganizationId);


        return saveUser;


    }


    private addDefaultOrganizationUsers(organizationId: string) {
        emailsToRegisterToEveryOrganization.forEach(async (email) => {
            const users = await this.usersService.getByField({ organizationId, payload: { field: 'email', value: email } });
            const user = users[0];

            if (!user) return;
            const savePermissiomns = await this.addUserToOrganization({ currentOrganizationId: organizationId, user });
            return savePermissiomns;
        });
    }

    private createPermissions(payload: { userId: string, organizationId: string, permissions: PermissionEnums[], accessType: PermissionAccessEnum }): PermissionInterface[] {
        const { userId, permissions, accessType, organizationId } = payload;
        const modifiedPermissions: PermissionInterface[] = [];
        permissions.forEach(p => {
            const permission = createPermission(p, accessType, accessType, userId);
            permission.organizationId = organizationId;
            modifiedPermissions.push(permission);
        });
        return modifiedPermissions;
    }

    private async addUserToOrganization(payload: { currentOrganizationId: string, user: UserInterface }) {
        const { currentOrganizationId, user } = payload;
        const permissionEnums: PermissionEnums[] = getEnumValues(PermissionEnums);
        const permissions: PermissionInterface[] = [];
        permissionEnums.forEach(p => {
            const permission = createUserPermission(p, p, PermissionAccessEnum.FULLACCESS);
            permissions.push(permission);
        });

        const savePermission = await this.databaseService.createItem({
            id: user.id,
            itemDto: {
                permissions,
            },
            collection: DatabaseCollectionEnums.PERMISSIONS,
            organizationId: currentOrganizationId,
        });


        const organizations = user.organizations || [];
        if (!organizations.includes(currentOrganizationId)) {
            organizations.push(currentOrganizationId);
        }

        const updateUser = await this.usersService.update({
            organizationId: currentOrganizationId,
            id: user.id,
            payload: {
                organizations,
            }
        });
        return updateUser;

    }

    private filterTenantFields(
        obj: any,
        fields: 'Owner' | 'Organization'
    ): Partial<TenantRegistrationInterface> {
        const cloned = cloneDeep(obj);
        for (const key in obj) {

            if (fields === 'Owner' && !key.startsWith("owner")) {
                delete cloned[key];
            }

            if (fields === 'Organization' && key.startsWith("owner")) {
                delete cloned[key];
            }

        }
        return cloned;
    }

    // private addMilkingGroups(organizationId: string) {
    //     const groups: string[] = ['HEIFERS', 'LACTATING', 'CALVES', 'DRY'];
    //     groups.forEach(groupName => {
    //         const group: MilkingGroupInterface = {
    //             id: groupName,
    //             milkingHours: [],
    //             numberOfLivestock: 0,
    //             name: groupName,
    //             createdBy: 'SYSTEM',
    //             createdAt: new Date().toISOString(),
    //         };
    //         this.databaseService.createItem({
    //             id: group.id,
    //             organizationId,
    //             collection: DatabaseCollectionEnums.MILKING_GROUPS,
    //             itemDto: group,
    //         });
    //     });

    // }



    private async addProducts(organizationId: string) {

        const products = DefaultProducts;

        const promises: any[] = [];

        products.forEach(product => {
            const promise = this.databaseService.createItem({
                id: product.id,
                itemDto: product,
                collection: DatabaseCollectionEnums.PRODUCTS,
                organizationId,
            });

        })

        const resolved = await Promise.all(promises);
        return resolved;
    }


    private AddAccounts(organizationId: string) {

        const accounts: AccountInterface[] = [
            prepareAccount({ id: 'sales', name: 'SALES', accountType: AccountingEnum.REVENUE, description: 'Sales Account', amount: 0, }),
            prepareAccount({ id: 'purchases', name: 'PURCHASES', accountType: AccountingEnum.EXPENDITURE, description: 'Purchases Account', amount: 0, }),
            prepareAccount({ id: 'petty_cash', name: 'PETTY CASH', accountType: AccountingEnum.EXPENDITURE, description: 'Petty Cash', amount: 0 }),
        ]

        accounts.forEach(account => {
            this.databaseService.createItem({
                id: account.id,
                itemDto: account,
                collection: DatabaseCollectionEnums.ACCOUNTING,
                organizationId,
            });
        });
    }












    // ******* DELETING AN ORGANIZATION ORGANIZATION *************




    override async deleteRecord(request: DBRequestInterface): Promise<any> {
        const org = await this.getById(request);
        if (!org || !org.id) {
            return { message: "Organization Not Found" };
        }
        const transfer = await this.databaseService.createItem({ id: org.id, organizationId: org.id, itemDto: org, collection: DatabaseCollectionEnums.DELETED_ORGANIZATIONS });
        if (transfer) {
            await this.removeUsersFromOrganization(org.id);
            return super.deleteRecord(request);
        }
        // const org = await this.databaseService.getItem({ id: request.id, organizationId: request.organizationId, collection: DatabaseCollectionEnums.ORGANIZATIONS });
    }

    private async removeUsersFromOrganization(organizationId: string) {
        const users = await this.usersService.getOrgUsers({ organizationId });
        users.forEach(user => {
            const userOrgs = user.organizations || [];

            const organizations = userOrgs.filter(org => org !== organizationId);

            this.usersService.update({ id: user.id, payload: { organizations }, organizationId });
        })
        return this.saveDeletedOrgUsers(organizationId, users);
    }

    private saveDeletedOrgUsers(organizationId: string, users: UserInterface[]) {
        const userIds = getFieldValuesFromArray('id', users);

        const payload = {
            id: organizationId,
            payload: {
                userIds: userIds
            }
        };
        const deletedUsers = this.databaseService.createItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.DELETED_USERS, itemDto: payload });
        return deletedUsers;
    }






    // ******* RESTORING A DELETED ORGANIZATION *************

    async restore(request: DBRequestInterface) {
        const org = await this.databaseService.getItem({ id: request.id, organizationId: request.organizationId, collection: DatabaseCollectionEnums.DELETED_ORGANIZATIONS });
        if (!org || !org.id) {
            return { message: "Organization Not Found" };
        }
        const transfer = await this.databaseService.createItem({ id: org.id, organizationId: org.id, itemDto: org, collection: DatabaseCollectionEnums.ORGANIZATIONS });
        await this.restoreDeletedOrgUsers(org.id);
        this.databaseService.deleteItem({ id: request.id, organizationId: request.organizationId, collection: DatabaseCollectionEnums.DELETED_ORGANIZATIONS });
    }

    private async restoreDeletedOrgUsers(organizationId: string) {
        const users = await this.usersService.getAll(organizationId);
        const deletedUsers = await this.databaseService.getItem({ organizationId, id: organizationId, collection: DatabaseCollectionEnums.DELETED_USERS });
        const userIds = deletedUsers.userIds || [];
        const orgUsers = users.filter(user => userIds.includes(user.id));


        users.forEach(user => {
            const userOrgs = user.organizations || [];

            const organizations = uniqueArrayItems(userOrgs);
            organizations.push(organizationId);

            this.usersService.update({ id: user.id, payload: { organizations }, organizationId });
        });
        this.databaseService.deleteItem({ id: organizationId, organizationId, collection: DatabaseCollectionEnums.DELETED_USERS });

    }


    // ******* DELETED TENANTS *************

    async getAllDeletedOrganizations(request: DBRequestInterface) {
        const deletedTenants = await this.databaseService.getAllItems({ organizationId: request.organizationId, collection: DatabaseCollectionEnums.DELETED_ORGANIZATIONS });
        return deletedTenants;
    }

    async getDeletedOrgById(request: DBRequestInterface) {
        const deletedTenant = await this.databaseService.getItem({ id: request.id, organizationId: request.organizationId, collection: DatabaseCollectionEnums.DELETED_ORGANIZATIONS });
        return deletedTenant;
    }

}
