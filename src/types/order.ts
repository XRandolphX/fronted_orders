export interface OrderItem {
  product_id: number;
  name: string;
  unit_price: string;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  date: string;
  total_price: string;
  status: string;
  items?: OrderItem[];
}
