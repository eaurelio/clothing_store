export interface OrderItemDB {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface OrderItemDOutput {
  item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export class OrderItem {
  constructor(
    private itemId: string,
    private orderId: string,
    private productId: string,
    private quantity: number,
    private price: number
  ) {}

  getItemId(): string {
    return this.itemId;
  }

  setItemId(itemId: string): void {
    this.itemId = itemId;
  }

  getOrderId(): string {
    return this.orderId;
  }

  setOrderId(orderId: string): void {
    this.orderId = orderId;
  }

  getProductId(): string {
    return this.productId;
  }

  setProductId(productId: string): void {
    this.productId = productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(price: number): void {
    this.price = price;
  }
}
