class LineItem {
  uuid: string;
  quantity: number;
  sku: string;
  title: string;
  unit_price: number;
  sub_total_price: number;
  tax_rate: number;
  total_tax: number;
  total_price: number;
}

class UserDetail {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
}

class PaymentDetail {
  uuid: string;
  payment_method: string;
  payment_status: string;
  sub_total_price: number;
  total_tax: number;
  total_price: number;
}

export class OrderEntity {
  uuid?: string;
  order_name?: string;
  line_items: LineItem[];
  user_detail: UserDetail;
  payment_detail: PaymentDetail;
}
