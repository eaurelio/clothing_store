import { BaseDatabase } from "./connection/BaseDatabase";
import { OrderDB } from "../models/Order";
import { OrderItemDB } from "./../models/OrderItem";

export class OrderDatabase extends BaseDatabase {
  public static TABLE_ORDERS = "orders";
  public static TABLE_ORDER_ITEMS = "order_items";
  public static TABLE_STATUS = "order_status";

  public async findOrderById(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        orders.order_id, 
        orders.user_id, 
        orders.order_date, 
        order_status.status_name AS status_name, 
        orders.total,
        orders.tracking_code
      FROM ${OrderDatabase.TABLE_ORDERS} orders
      INNER JOIN order_status 
        ON orders.status_id = order_status.status_id
      WHERE orders.order_id = ?
      `,
      [order_id]
    );

    return result.rows[0];
  }

  public async findPureOrderById(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        orders.order_id, 
        orders.user_id, 
        orders.order_date, 
        orders.status_id, 
        orders.total,
        orders.tracking_code
      FROM ${OrderDatabase.TABLE_ORDERS} orders
      WHERE orders.order_id = ?
      `,
      [order_id]
    );

    return result.rows[0];
  }

  public async getAllStatus() {
    const result = await BaseDatabase.connection.raw(`
          SELECT * FROM ${OrderDatabase.TABLE_STATUS}
        `);

    return result.rows;
  }

  public async insertOrder(newOrderDB: OrderDB): Promise<void> {
    const columns = Object.keys(newOrderDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newOrderDB);

    const query = `
      INSERT INTO ${OrderDatabase.TABLE_ORDERS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async updateOrder(
    order_id: string,
    updatedOrderDB: Partial<OrderDB>
  ): Promise<void> {
    const columns = Object.keys(updatedOrderDB);
    const values = Object.values(updatedOrderDB);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${OrderDatabase.TABLE_ORDERS}
      SET ${setClause}
      WHERE order_id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, order_id]);
  }

  public async findOrderItemsByOrderId(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE order_id = ?
    `,
      [order_id]
    );

    return result.rows;
  }

  public async findOrdersByUserId(userId?: string, orderId?: string) {
    let query = `
    SELECT 
      orders.order_id, 
      orders.user_id, 
      orders.order_date, 
      order_status.status_id,
      order_status.status_name AS status_name, 
      orders.total,
      orders.tracking_code
    FROM ${OrderDatabase.TABLE_ORDERS} orders
    INNER JOIN order_status 
      ON orders.status_id = order_status.status_id
    WHERE 1=1
  `;
    const params: (string | undefined)[] = [];

    if (userId) {
      query += " AND orders.user_id = ?";
      params.push(userId);
    }

    if (orderId) {
      query += " AND orders.order_id = ?";
      params.push(orderId);
    }

    const result = await BaseDatabase.connection.raw(query, params);

    return result.rows;
  }

  public async deleteOrderItemsByOrderId(order_id: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      DELETE FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE order_id = ?
    `,
      [order_id]
    );
  }

  public async insertOrderItem(orderItem: OrderItemDB): Promise<void> {
    const columns = Object.keys(orderItem);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(orderItem);

    const query = `
      INSERT INTO order_items (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async deleteOrderItem(item_id: string): Promise<void> {
    const query = `
      DELETE FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE item_id = ?
    `;
    await BaseDatabase.connection.raw(query, [item_id]);
  }

  public async cancelOrderById(orderId: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${OrderDatabase.TABLE_ORDERS}
      SET status_id = 5
      WHERE order_id = ?
      `,
      [orderId]
    );
  }

  public async deleteOrder(order_id: string): Promise<void> {
    const query = `
    DELETE FROM ${OrderDatabase.TABLE_ORDERS}
    WHERE order_id = ?
  `;
    await BaseDatabase.connection.raw(query, [order_id]);
  }
}
