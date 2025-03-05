import { RecordInterface } from './record.interface';
import { CartItemInterface } from './product.interface';

export interface OrderInterface extends RecordInterface {
  email: string;
  items: CartItemInterface[];
  location: string;
  comment: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  amountPaid: number;
  totalCost: number;
  taxes: number;
  transportCost: number;
  shippedAt?: string;
  deliveredAt?: string;
  paidAt?: string;
  declinedAt?: string;
}
