/* eslint-disable prettier/prettier */

import { PermissionAccessEnum, PermissionEnums, PermissionInterface } from "src/shared/interfaces/permission.interface";


export function CreatePermissionFromEnums(payload: { id: string, permissionEnums: PermissionEnums[] }): PermissionInterface[] {
    const permissions: PermissionInterface[] = [];
    const { id, permissionEnums } = payload;

    permissionEnums.forEach(p => {
        const permission = createSinglePermission(id, p);
        permissions.push(permission);
    });

    return permissions;
}

function createSinglePermission(id: string, permissionEnum: PermissionEnums): PermissionInterface {
    const permission: PermissionInterface = {
        permission: permissionEnum,
        userId: id,
        permissionType: PermissionAccessEnum.FULLACCESS,
        admin: true,
        create: true,
        read: true,
        update: true,
        delete: true,
        professional: true,
    };
    return permission;
}

export function setPermissions(id: string, userPermissions: string[]): PermissionInterface[] {
    let permissions: PermissionInterface[] = [];

    userPermissions.forEach((permission) => {
        switch (permission) {



            // case 'livestockManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.LIVESTOCK, permission, PermissionAccessEnum.FULLACCESS, id),
            //     ]);
            //     break;

            // case 'livestockProfessional':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.LIVESTOCK, permission, PermissionAccessEnum.PROFESSIONAL, id),
            //     ]);
            //     break;

            // // feeds
            // case 'feedsEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.CREATE, id),
            //     ]);
            //     break;

            // case 'feedsManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.FULLACCESS, id),
            //     ]);
            //     break;

            // case 'feedsProfessional':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.FEEDS, permission, PermissionAccessEnum.PROFESSIONAL, id),
            //     ]);
            //     break;

            // products
            case 'productsEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;

            case 'productsManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.FULLACCESS, id),
                ]);
                break;

            case 'productsProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.PRODUCTS, permission, PermissionAccessEnum.PROFESSIONAL, id),
                ]);
                break;

            // HR
            case 'hrEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;

            case 'hrManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.FULLACCESS, id),
                ]);
                break;

            case 'hrProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.USERS, permission, PermissionAccessEnum.PROFESSIONAL, id),
                ]);
                break;


            // Transport
            // case 'transportManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.TRANSPORT, permission, PermissionAccessEnum.FULLACCESS, id),
            //     ]);
            //     break;

            // case 'transportEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.TRANSPORT, permission, PermissionAccessEnum.CREATE, id),
            //     ]);
            //     break;

            // // Supplier / Farmer
            // case 'supplierManagement':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.SUPPLIER, permission, PermissionAccessEnum.FULLACCESS, id),
            //     ]);
            //     break;

            // case 'supplierEmployee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.SUPPLIER, permission, PermissionAccessEnum.CREATE, id),
            //     ]);
            //     break;


            // // Personnel
            // case 'employee':
            //     permissions = permissions.concat([
            //         createPermission(PermissionEnums.PERSONNEL, permission, PermissionAccessEnum.CREATE, id),
            //     ]);

            //     break;

            // Creditors
            case PermissionEnums.CREDITOR:
                permissions = permissions.concat([
                    createPermission(PermissionEnums.CREDITOR, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;

            // Debtors
            case PermissionEnums.DEBTOR:
                permissions = permissions.concat([
                    createPermission(PermissionEnums.DEBTOR, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;


            // Farmers
            case 'farmer':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.DEBTOR, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;

            // // Accounting
            // case PermissionEnums.ACCOUNTING:
            //   permissions = permissions.concat([
            //     createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.CREATE, id),
            //   ]);
            //   break;

            // Accounting
            case 'accountingEmployee':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.CREATE, id),
                ]);
                break;

            case 'accountingManagement':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.FULLACCESS, id),
                ]);
                break;

            case 'accountingProfessional':
                permissions = permissions.concat([
                    createPermission(PermissionEnums.ACCOUNTING, permission, PermissionAccessEnum.PROFESSIONAL, id),
                ]);
                break;


            default:


                break;
        }


    });

    return permissions;

}



function createPermission(permission: PermissionEnums, permissionType: string, access: PermissionAccessEnum, id: string): PermissionInterface {

    // const find = permissions.filter(p => p.permission === permission && permissionType === permissionType);

    const createdPermission = createUserPermission(permission, permissionType, access);
    createdPermission.userId = id;
    return createdPermission;
}

function createUserPermission(permission: PermissionEnums, permissionType: string, access: PermissionAccessEnum): PermissionInterface {
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