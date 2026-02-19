import { apiFetch } from './client';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  _id: string;
  company: string;
  companyName: string;
  orgNumber: number;
  orderedBy: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await apiFetch('/orders/my-orders');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? data.error ?? 'Failed to fetch orders');
  }
  return res.json();
}
