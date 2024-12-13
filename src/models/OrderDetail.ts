type MenuDetail = {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number;
  image_url: string;
  rating: number;
};

type OrderDetail = {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  subtotal_price: number;
  notes: string;
  menu_detail: MenuDetail;
};

type Payment = {
  ID: number;
  order_id: number;
  payment_method: string;
  payment_status: string;
  payment_create_date: string;
  payment_expired_date: string;
  payment_account_number?: string;
  payment_account_name?: string;
  payment_qrcode_url?: string;
  transaction_code: string;
};

export type OrderResponse = {
  id: number;
  order_date: string;
  email: string;
  name: string;
  total_price: number;
  order_status: string;
  payments: Payment;
  order_details: OrderDetail[];
};
