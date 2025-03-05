/* eslint-disable prettier/prettier */

import { RecordInterface } from "src/shared/interfaces/record.interface";

export enum TenantTypeEnums {
    INDIVIDUAL = 'individual',
    CORPORATE = 'corporate',
}

export interface TenantInterface extends RecordInterface {
    shortName: string,
    fullName: string,
    email: string,
    phone: string,
    county: string,
    subCounty: string,
    dateFounded: string,
    activeUntil?: string,
    type: TenantTypeEnums
    // orgCode: string,
}

export interface TenantRegistrationInterface extends TenantInterface {
    ownerName: string,
    ownerEmail: string,
    ownerPhone: string,
    ownerIdNumber: string,
}