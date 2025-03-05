/* eslint-disable prettier/prettier */

import { PermissionAccessEnum, PermissionEnums, PermissionInterface } from "../interfaces/permission.interface";


// export function preparePermissionsList(payload: { userId: string, permissions: PermissionEnums[], accessType: PermissionAccessEnum }): PermissionInterface[] {
//     const { userId, permissions, accessType } = payload;
//     const modifiedPermissions: PermissionInterface[] = [];
//     permissions.forEach(p => {
//         const permission = createPermission(p, accessType, accessType, userId);
//         modifiedPermissions.push(permission);
//     });
//     return modifiedPermissions;
// }


export function setPermissions(userId: string, userPermissions: string[]): PermissionInterface[] {
    let permissions: PermissionInterface[] = [];

    userPermissions.forEach((permission) => {
        switch (permission) {


            // // livestock
            // case 'livestockEmployee':

            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.LIVESTOCK, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);

            //     break;

            // case 'livestockManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.LIVESTOCK, permission, PermissionAccessEnum.FULLACCESS, userId),
            //     ]);
            //     break;

            // case 'livestockProfessional':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.LIVESTOCK, permission, PermissionAccessEnum.PROFESSIONAL, userId),
            //     ]);
            //     break;

            // // feeds
            // case 'feedsEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;

            // case 'feedsManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.FULLACCESS, userId),
            //     ]);
            //     break;

            // case 'feedsProfessional':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.PROFESSIONAL, userId),
            //     ]);
            //     break;

            // products
            case 'productsEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.CREATE, userId),
                ]);
                break;

            case 'productsManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.FULLACCESS, userId),
                ]);
                break;

            case 'productsProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.PROFESSIONAL, userId),
                ]);
                break;

            // HR
            case 'hrEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.CREATE, userId),
                ]);
                break;

            case 'hrManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.FULLACCESS, userId),
                ]);
                break;

            case 'hrProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.PROFESSIONAL, userId),
                ]);
                break;


            // Transport
            // case 'transportManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.TRANSPORT, permission, PermissionAccessEnum.FULLACCESS, userId),
            //     ]);
            //     break;

            // case 'transportEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.TRANSPORT, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;

            // Supplier / Farmer
            // case 'supplierManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.SUPPLIER, permission, PermissionAccessEnum.FULLACCESS, userId),
            //     ]);
            //     break;

            // case 'supplierEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.SUPPLIER, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;


            // Personnel
            // case 'employee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.PERSONNEL, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);

            //     break;

            // Creditors
            // case PermissionEnums.CREDITOR:
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.CREDITOR, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;

            // Debtors
            // case PermissionEnums.DEBTOR:
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.DEBTOR, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;


            // Farmers
            // case 'farmer':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FARMER, permission, PermissionAccessEnum.CREATE, userId),
            //     ]);
            //     break;

            // // Accounting
            // case PermissionEnums.ACCOUNTING:
            //   permissions = permissions.concat([
            //    createPermission(PermissionEnums.ACCOUNTING, permission,PermissionAccessEnum.CREATE, userId),
            //   ]);
            //   break;

            // Accounting
            case 'accountingEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.CREATE, userId),
                ]);
                break;

            case 'accountingManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.FULLACCESS, userId),
                ]);
                break;

            case 'accountingProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.PROFESSIONAL, userId),
                ]);
                break;


            default:


                break;
        }


    });

    return permissions;

}

export function createPermission(permission: PermissionEnums, permissionType: string, access: PermissionAccessEnum, userId: string): PermissionInterface {
    const createdPermission = createUserPermission(permission, permissionType, access);
    createdPermission.userId = userId;
    return createdPermission;
}

export function createUserPermission(permission: PermissionEnums, permissionType: string, access: PermissionAccessEnum): PermissionInterface {
    let createdPermission: PermissionInterface = {
        permission: permission,
        permissionType: permissionType,
        admin: false,
        create: true,
        read: false,
        update: false,
        delete: false,
        professional: false,
    };
    if (access === PermissionAccessEnum.CREATE) {
        createdPermission = {
            permission: permission,
            permissionType: permissionType,
            admin: false,
            create: true,
            read: true,
            update: false,
            delete: false,
            professional: false,
        }
    } else if (access === 'read') {
        createdPermission = {
            permission: permission,
            permissionType: permissionType,
            admin: false,
            create: false,
            read: true,
            update: false,
            delete: false,
            professional: false,
        }

    } else if (access === 'update') {
        createdPermission = {
            permission: permission,
            permissionType: permissionType,
            admin: false,
            create: true,
            read: true,
            update: true,
            delete: false,
            professional: false,
        }



    } else if (access === PermissionAccessEnum.FULLACCESS) {
        createdPermission = {
            permission: permission,
            permissionType: permissionType,
            admin: true,
            create: true,
            read: true,
            update: true,
            delete: true,
            professional: true,
        }

    } else if (access === PermissionAccessEnum.PROFESSIONAL) {
        createdPermission = {
            permission: permission,
            permissionType: permissionType,
            admin: false,
            create: true,
            read: true,
            update: true,
            delete: true,
            professional: true,
        }

    }

    return createdPermission;
}


export function generatePayrollPermission(
    userId: string,
    permissionType: PermissionEnums
) {
    const permission: PermissionInterface = {
        userId,
        permission: permissionType,
        permissionType: PermissionAccessEnum.CREATE,
        admin: false,
        create: true,
        read: true,
        update: false,
        delete: false,
        professional: false,
    };
    return permission;
}