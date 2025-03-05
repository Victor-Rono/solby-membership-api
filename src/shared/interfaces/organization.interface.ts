/* eslint-disable prettier/prettier */
import { RecordInterface } from "src/shared/interfaces/record.interface";

/* eslint-disable prettier/prettier */
export enum OrgTypesEnum {
  DAIRY_FARM = 'Dairy Farm',
  DISTRIBUTOR = 'Distributor',
  // DISTRIBUTOR = 'distributor',

}
export interface OrganizationInterface extends RecordInterface {
  id: string,
  orgCode: string,
  shortName: string,
  fullName: string,
  phoneNumber: string,
  phone?: string,
  email: string,
  description: string,
  imageURL: string,
  daysLeft: number,
  type: OrgTypesEnum,
  createdBy: 'SYSTEM'

}



