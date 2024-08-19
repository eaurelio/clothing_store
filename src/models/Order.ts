import { OrderItemDB } from "./OrderItem";

export interface OrderDB {
  order_id: string;
  user_id: string;
  status_id: number;
  total: number;
  order_date: string;
  tracking_code?: string;
}

export interface OrderDBOutput {
  order_id: string;
  user_id: string;
  items: OrderItemDB[];
  status_name: string;
  total: number;
  order_date: string;
  tracking_code: string;
}

export class Order {
  constructor(
    private orderId: string,
    private userId: string,
    private items: { productId: string; quantity: number; price: number }[],
    private statusId: number, // Ajustado para number
    private total: number,
    private orderDate: string
  ) {}

  getOrderId(): string {
    return this.orderId;
  }

  setOrderId(orderId: string): void {
    this.orderId = orderId;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getItems(): { productId: string; quantity: number; price: number }[] {
    return this.items;
  }

  setItems(
    items: { productId: string; quantity: number; price: number }[]
  ): void {
    this.items = items;
  }

  getOrderDate(): string {
    return this.orderDate;
  }

  setOrderDate(orderDate: string): void {
    this.orderDate = orderDate;
  }

  getStatusId(): number {
    // Ajustado para number
    return this.statusId;
  }

  setStatusId(statusId: number): void {
    // Ajustado para number
    this.statusId = statusId;
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(total: number): void {
    this.total = total;
  }
}
