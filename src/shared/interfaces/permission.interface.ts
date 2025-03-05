/* eslint-disable prettier/prettier */



// export enum PermissionEnums {
//     USERS = 'users',
//     LIVESTOCK = 'livestock',
//     FEEDS = 'feeds',
//     PRODUCTS = 'products',
//     ADMIN = 'admin',
//     RECORDS = 'records',
//     REPORTS = 'reports',
//     TRANSPORT = 'transport',
//     SUPPLIER = 'supplier',
//     FARMER = 'farmer',
//     PERSONNEL = 'personnel',
//     CREDITOR = 'creditor',
//     DEBTOR = 'debtor',
//     ACCOUNTING = 'accounting',
//     ORGANIZATIONS = 'organizations',
// }

export enum PermissionEnums {
    USERS = 'users',
    PRODUCTS = 'products',
    SALES = 'sales',
    ADMIN = 'admin',
    RECORDS = 'records',
    REPORTS = 'reports',
    ACCOUNTING = 'accounting',
    // TRANSPORT = 'transport',
    // SUPPLIER = 'supplier',
    // FARMER = 'farmer',
    PAYROLL = 'payroll',
    CREDITOR = 'creditor',
    DEBTOR = 'debtor',
    ORGANIZATIONS = 'organizations',
    // ALL = 'all',
}

export enum PermissionAccessEnum {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    PROFESSIONAL = 'professional',
    FULLACCESS = 'fullAccess',
}
export interface PermissionInterface {
    userId?: number | string | undefined,
    organizationId?: string,
    permission: PermissionEnums,
    permissionType: string,
    admin: boolean | number,
    create: boolean | number,
    read: boolean | number,
    update: boolean | number,
    delete: boolean | number,
    professional: boolean | number,
}

