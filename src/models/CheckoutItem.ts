import { Product } from "./Product";

export interface CheckoutItem {
  product: Product;
  total_item: number;
  note: string;
}
