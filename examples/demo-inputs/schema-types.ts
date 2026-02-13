export type OrderStatus = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  metadata: any;
  tags: object;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  statusCode: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export async function processPayment(
  orderId: string,
  paymentMethodId: string
) {
  const order = await fetch(`/api/orders/${orderId}`).then((r) => r.json());

  if (!order.data) {
    return { success: false, error: "Order not found" };
  }

  const result = await fetch("/api/payments", {
    method: "POST",
    body: JSON.stringify({ orderId, paymentMethodId, amount: order.data.totalAmount }),
  }).then((r) => r.json());

  if (result.error) {
    return { success: false, error: result.error, retryable: result.statusCode >= 500 };
  }

  return { success: true, transactionId: result.data.transactionId };
}
