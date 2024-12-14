export type CheckoutResponse = {
  status: string;
  message: string;
  code: number;
  data: {
    order_id: number;
    transaction_code: string;
  };
};
