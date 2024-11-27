import { PaymentMethod } from "./PaymentMethod";
import { Product } from "./Product";

export interface Payment {
  products: Product[];
  payment_method: PaymentMethod;
}
