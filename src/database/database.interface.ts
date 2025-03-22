/* eslint-disable prettier/prettier */

export type DBStatusTypes =
    | 'Active'
    | 'Approved'
    | 'Pending'
    | 'Unavailable'
    | 'Completed'
    | 'Cancelled'
    | 'Hidden';


export enum DatabaseCollectionEnums {

    // Dashboard
    // ALL = '',
    DASHBOARD = 'dashboard',
    ADMINS = 'admins',
    SUBSCRIPTIONS = 'subscriptions',
    SUBSCRIPTIONS_CONFIG = 'subscriptions-config',

    // Membership
    MEMBERS = 'members',
    MEMBER_ACCOUNTS = 'member-accounts',
    GROUPS = 'groups',



    // USER MANAGEMENT
    USERS = 'users',
    USERS_BACKUP = 'users-backup',
    AUTH = 'auth',
    OTP = 'otp',
    CREDENTIALS = 'credentials_',
    PASSWORD_RESETS = 'password-resets_',

    // MILKING
    MILKING_REPORTS = 'milking-reports',
    MILKING_SESSIONS = 'milking-sessions',
    MILKING_GROUPS = 'milking-groups',
    MILKING_RECORDS = 'milking-records-2',
    COLLECT_MILK_FOR_ALL = 'collect-milk-for-all',


    // TRANSPORT
    TRANSPORT_VEHICLES = 'transport-vehicles',
    TRANSPORT_ROUTES = 'transport-routes',
    TRANSPORTERS = 'transporters',

    // FEEDS
    FEEDS = 'feeds',
    FEED_BATCHES = 'feed-batches',
    FEEDING_RATIONS = 'feeding-rations',

    // Sales
    // SALES = '__invoices__',
    SALE_RECORDS = 'sale-records',
    INVOICE_SALES = 'invoice_sales_',

    // MT_SALES = 'mt_sales',
    // MT_PURCHASES = 'mt_purchases',

    // Purchases
    // PURCHASES = '__invoices__',
    INVOICE_PURCHASES = 'invoice_purchases_',
    PURCHASE_RECORDS = 'purchase-records',

    // Products 
    PRODUCTS = 'products',
    STOCK_REMOVAL = 'stock-removal',
    PRODUCT_SALES = 'product-sales',
    UNSOLD_PRODUCTS = 'unsold-products',
    // PRODUCT_BATCHES = 'product-batches',

    // Livestock
    LIVESTOCK = 'livestock',
    LIVESTOCK_SALES = 'livestock-sales',
    LIVESTOCK_PURCHASES = 'livestock-purchases',
    LIVESTOCK_DEATH = 'livestock-death',
    DEAD_LIVESTOCK = 'dead-livestock',
    SOLD_LIVESTOCK = 'sold-livestock',
    CALVES_CONSUMPTION = 'calves-consumption_',
    LIVESTOCK_HISTORY = 'livestock-history',

    // Health
    TREATMENT_SCHEDULES = 'treatment-schedules',
    MEDICAL_RECORDS = 'medical-records',
    // VACCINATIONS = 'vaccinations',
    // DEwORMING_RECORDS = 'deworming-records',

    // Accounting
    ACCOUNTING = 'accounting',
    LEDGER = 'ledger_',
    ACCOUNT_TRANSFERS = 'account-transfers',
    FUND_TRANSFERS = 'fund-transfers',
    PAYROLL = 'payroll',

    // Petty Cash
    PETTY_CASH = 'petty-cash',

    REPORTS = 'reports',
    FEEDING_GROUPS = 'feeding-groups',
    COUNTIES = 'counties',
    REGIONS = 'regions',
    BREEDING_SESSIONS = 'breeding-sessions',
    MILKING_HOURS = 'milking-hours',
    FEEDING_HOURS = 'feeding-hours',
    INVITATIONS = 'invitations',
    INVOICES = 'Invoices__',
    PERMISSIONS = 'permissions',
    NOTIFICATIONS = 'notifications',
    CHATS = 'chats',
    BULK_PRODUCTS = 'bulk-products',
    MESSAGES = 'messages',
    EMPLOYEES = 'employees',
    CREDITORS = 'creditors_',
    FARMERS = 'farmers_',
    DEBTORS = 'debtors_',
    PAYMENTS = 'payments',
    PAYSLIPS = 'payslips',

    EXPENSES = 'expenses',
    PRODUCT_DELIVERIES = 'product-deliveries',
    ADVANCE_ORDERS = 'advance-orders',

    // AGROVET
    AGROVET = 'agrovet',
    AGROVET_SALES = 'agrovet-sales',
    AGROVET_SALE_RECORDS = 'agrovet-sale-records',
    AGROVET_PURCHASE_RECORDS = 'agrovet-purchase-records',
    AGROVET_PRODUCTS = 'agrovet-products',




    // BREEDING
    BREEDING = 'breeding',
    BREEDING_RECORDS = 'breeding-records',
    CALVING_RECORDS = 'calving-records',
    PREGNANCIES = 'pregnancies',

    // LIVESTOCK HEALTH
    TREATMENT_RECORDS = 'treatment-records',
    DEWORMING_RECORDS = 'deworming-records',
    VACCINATION_RECORDS = 'vaccination-records',
    DISEASE_CATALOG = 'disease-catalog',

    // ORGANIZATIONS
    ORGANIZATIONS = 'organizations',
    TENANTS = 'organizations',
    DELETED_ORGANIZATIONS = 'deleted-organizations',
    DELETED_USERS = 'deleted-users',

    // SMS
    SMS = 'sms',

    // Assets
    ASSETS = 'assets',
    ASSET_CATEGORIES = 'asset-categories',


    MT_EXPENSES = 'mt_expenses',
    MT_EXPENSE_CATEGORIES = 'mt_expense-categories',


    MT_REVENUES = `mt_revenues`,
    MT_REVENUE_CATEGORIES = `mt_revenue-categories`,

    SERIAL_NUMBERS = 'serial-numbers',

}

export interface DeleteOptionsInterface {
    permanentDelete?: 'permanentDelete';
    skipImages?: 'skipImages';
    skipDocuments?: 'skipDocuments';
    skipConfirm?: 'skipConfirm';
}

export interface FieldValueInterface {
    field: string;
    value: any;
}



export interface ClientRequestInterface {
    organizationId: string;
    id: string;
}
export interface PayloadInterface extends ClientRequestInterface {
    data: any,
}


export interface ParsedCollectionInterface {
    collection: DatabaseCollectionEnums;
    organizationId: string | null;
}


export interface MultipleFieldQueryInterface {
    fields: FieldValueInterface[];
    queryType?: 'matchAll' | 'matchOne';
    collection: DatabaseCollectionEnums;
}

export interface QueryCollectionInterface {
    organizationId: string,
    collection: DatabaseCollectionEnums,
    query?: any,
}

export interface GetByIdInterface extends QueryCollectionInterface {
    id: string,
}

export interface GetAllItemsInterface extends QueryCollectionInterface {
    option?: { includeDeleted?: 'includeDeleted' }
}

export interface GetByFieldInterface extends QueryCollectionInterface {
    field: string,
    value: any,
}

export interface GetByMultipleFieldsInterface extends QueryCollectionInterface {
    query: MultipleFieldQueryInterface
}

export interface CreateItemInterface extends QueryCollectionInterface {
    id: string,
    itemDto: any,
}

export interface updateItemInterface extends QueryCollectionInterface {
    id: string,
    itemDto: any,
}
export interface checkIfExistsInterface extends QueryCollectionInterface {
    fields: FieldValueInterface[],
}


export interface MultipleFieldValueInterface {
    fields: FieldValueInterface[];
    queryType?: 'matchAll' | 'matchOne';
    collection: DatabaseCollectionEnums;
}

export interface DBRequestInterface {
    id?: string,
    payload?: any,
    organizationId: string,
    collection?: DatabaseCollectionEnums,
}

export interface UpdateDBInterface extends DBRequestInterface {
    payload: any,
    collection: DatabaseCollectionEnums,

}


export interface CreateRequestInterface extends DBRequestInterface {
    payload: any,
}

export interface MultipleFieldRequestInterface {
    id?: string,
    payload: {
        fields: FieldValueInterface[];
        queryType?: 'matchAll' | 'matchOne';
    }
    organizationId: string,
    collection: DatabaseCollectionEnums,
}

export interface FieldValueRequestInterface extends DBRequestInterface {
    payload: FieldValueInterface,
}

