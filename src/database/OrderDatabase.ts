import { BaseDatabase } from "./connection/BaseDatabase";
import { OrderDB } from "../models/Order";
import { OrderItemDB } from "./../models/OrderItem";

export class OrderDatabase extends BaseDatabase {
  public static TABLE_ORDERS = "orders";
  public static TABLE_ORDER_ITEMS = "order_items";
  public static TABLE_STATUS = 'order_status'

  // ORDER DATA

  // public async findOrders(userId?: string) {
  //   let conditions: string[] = [];
  //   let params: any[] = [];

  //   if (userId) {
  //     conditions.push("orders.user_id = ?");
  //     params.push(userId);
  //   }

  //   const whereClause =
  //     conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  //   const result = await BaseDatabase.connection.raw(
  //     `
  //     SELECT *
  //     FROM ${OrderDatabase.TABLE_ORDERS}
  //     ${whereClause}
  //   `,
  //     params
  //   );

  //   return result[0];
  // }

  public async findOrderById(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        orders.order_id, 
        orders.user_id, 
        orders.order_date, 
        order_status.status_name AS status_name, 
        orders.total
      FROM ${OrderDatabase.TABLE_ORDERS} orders
      INNER JOIN order_status 
        ON orders.status_id = order_status.status_id
      WHERE orders.order_id = ?
      `,
      [order_id]
    );

    return result[0];
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

  // ORDER ITEMS DATA

  // public async findOrderItems(order_id: string) {
  //   const result = await BaseDatabase.connection.raw(
  //     `
  //     SELECT *
  //     FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
  //     WHERE order_id = ?
  //   `,
  //     [order_id]
  //   );

  //   return result[0];
  // }

  public async findOrderItemsByOrderId(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE order_id = ?
    `,
      [order_id]
    );

    return result;
  }

  public async findOrdersByUserId(userId: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        orders.order_id, 
        orders.user_id, 
        orders.order_date, 
        order_status.status_name AS status_name, 
        orders.total
      FROM ${OrderDatabase.TABLE_ORDERS} orders
      INNER JOIN order_status 
        ON orders.status_id = order_status.status_id
      WHERE orders.user_id = ?
      `,
      [userId]
    );

    return result;
  }

  public async insertOrderItem(newOrderItemDB: OrderItemDB): Promise<void> {
    const columns = Object.keys(newOrderItemDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newOrderItemDB);

    const query = `
      INSERT INTO ${OrderDatabase.TABLE_ORDER_ITEMS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  // public async updateOrderItem(
  //   item_id: string,
  //   updatedOrderItemDB: Partial<OrderItemDB>
  // ): Promise<void> {
  //   const columns = Object.keys(updatedOrderItemDB);
  //   const values = Object.values(updatedOrderItemDB);

  //   const setClause = columns.map((col) => `${col} = ?`).join(", ");

  //   const query = `
  //     UPDATE ${OrderDatabase.TABLE_ORDER_ITEMS}
  //     SET ${setClause}
  //     WHERE item_id = ?
  //   `;

  //   await BaseDatabase.connection.raw(query, [...values, item_id]);
  // }

  public async deleteOrderItemsByOrderId(order_id: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      DELETE FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE order_id = ?
    `,
      [order_id]
    );
  }

  // public async updateOrderItemQuantity(
  //   item_id: string,
  //   quantity: number
  // ): Promise<void> {
  //   const query = `
  //     UPDATE ${OrderDatabase.TABLE_ORDER_ITEMS}
  //     SET quantity = ?
  //     WHERE item_id = ?
  //   `;
  //   await BaseDatabase.connection.raw(query, [quantity, item_id]);
  // }

  // public async findOrderItemByOrderIdAndProductId(
  //   order_id: string,
  //   product_id: string
  // ): Promise<OrderItemDB | undefined> {
  //   const result = await BaseDatabase.connection.raw(
  //     `
  //     SELECT *
  //     FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
  //     WHERE order_id = ? AND product_id = ?
  //   `,
  //     [order_id, product_id]
  //   );
  //   return result[0][0];
  // }

  public async deleteOrderItem(item_id: string): Promise<void> {
    const query = `
      DELETE FROM ${OrderDatabase.TABLE_ORDER_ITEMS}
      WHERE item_id = ?
    `;
    await BaseDatabase.connection.raw(query, [item_id]);
  }

  public async deleteOrder(order_id: string): Promise<void> {
    const query = `
    DELETE FROM ${OrderDatabase.TABLE_ORDERS}
    WHERE order_id = ?
  `;
    await BaseDatabase.connection.raw(query, [order_id]);
  }

  public async getAllStatus() {
    const result = await BaseDatabase.connection.raw(`
        SELECT * FROM ${OrderDatabase.TABLE_STATUS}
      `)

    return result
  }
}
