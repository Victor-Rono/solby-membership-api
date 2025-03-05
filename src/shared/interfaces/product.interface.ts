/* eslint-disable prettier/prettier */
import { DescriptionInterface } from './description.interface';
import { FileUploadInterface } from './file-manager.interface';
import { UnitEnums } from '../enums/units.enums';
import { RecordInterface } from './record.interface';

// export interface ProductInterface extends RecordInterface {
//   name: string,
//   unitPrice: number,
//   units: string,
//   shortDescription?: string,
//   description: string,
//   buyingPrice: number,
//   // minSellingPrice: number,
//   // maxSellingPrice: number,
//   // manufactureDate?: string,
//   quantity?: number,
//   expiryDate: string,
//   photoURL?: string,
// }

export interface ProductInterface extends RecordInterface {
  id: string,
  name: string,
  quantity: number,
  unitPrice: number,
  units: UnitEnums,
  description: string,
  buyingPrice: number,
  manufactureDate?: string,
  availability?: ProductAvailabilityTypes,
  expiryDate?: string,
}


// export interface UploadProductInterface {
//   product: Partial<ProductInterface>,
//   files: File[],
// }

export interface CartInterface {
  id?: string;
  backupId?: string;
  email: string;
  currency: string;
  status?: string;
  message?: string;
  items: CartItemInterface[];
}

export interface CartItemInterface {
  id: string;
  name: string;
  quantity: number;
  imageURL?: string;
  unitPrice?: number;
  tax?: number;
  outOfStock?: boolean;
  addedAt: number;
  subscription?: boolean;
  type?: string;
}

export interface CategoryInterface extends RecordInterface {
  name: string;
  description: string;
  unitPrice?: number;
  eastAfricaPrice?: number;
  currency?: string;
}

export interface categorySubscriptionInterface extends RecordInterface {
  userId: string;
  categories: CategoryStatusInterface[];
  expiryDate: string | number;
}

export type CategoryStatusType = `Unpaid` | `Expired` | `Paid`;
export type SubscriptionMessageType =
  | 'Subscribe'
  | 'Renew Subscription'
  | 'Select';

export interface CategoryStatusInterface {
  id: string;
  status: 'Paid' | 'Pending';
  created_at: string;
}

export interface UploadProductInterface {
  product: Partial<ProductInterface>;
  files: FileUploadInterface[];
  options?: ProductOptionsInterface;
}

export interface ProductOptionsInterface {
  hideNotification?: boolean;
  redirectURL?: string;
}
export type SubCategoryInterface = DescriptionInterface;

export type ProductAvailabilityTypes =
  | 'FACTORY ORDER'
  | 'AVAILABLE'
  | 'SOLD'
  | 'UNAVAILABLE';

export interface ProductAvailabilityInterface {
  title: ProductAvailabilityTypes;
  description: string;
}

export enum StockRemovalReasonsEnum {
  EXPIRED = 'Expired',
  CONSUMED_LOCALLY = 'Consumed Locally',
  CONSUMED_BY_CALVES = 'Consumed by Calves',
  OTHER = 'Other',
}

export interface StockRemovalInterface {
  productId: string;
  quantity: number;
  reason: StockRemovalReasonsEnum;
  description: string;
}

export interface UnsoldProductInterface {
  id?: string;
  status: 'Active' | 'Closed',
  productId: string;
  name: string;
  quantity: number;
  createdAt: string;
};
