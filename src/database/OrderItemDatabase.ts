import { BaseDatabase } from "./connection/BaseDatabase";
import { OrderItemDB } from "../models/OrderItem";

export class OrderItemDatabase extends BaseDatabase {
  public static TABLE_ORDER_ITEMS = "order_items";

  // ORDER ITEM DATA

  public async findOrderItems(order_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${OrderItemDatabase.TABLE_ORDER_ITEMS}
      WHERE order_id = ?
    `,
      [order_id]
    );

    return result[0];
  }

  public async findOrderItemById(item_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${OrderItemDatabase.TABLE_ORDER_ITEMS}
      WHERE item_id = ?
    `,
      [item_id]
    );

    return result[0];
  }

  public async insertOrderItem(newOrderItemDB: OrderItemDB): Promise<void> {
    const columns = Object.keys(newOrderItemDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newOrderItemDB);

    const query = `
      INSERT INTO ${OrderItemDatabase.TABLE_ORDER_ITEMS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async updateOrderItem(
    item_id: string,
    updatedOrderItemDB: Partial<OrderItemDB>
  ): Promise<void> {
    const columns = Object.keys(updatedOrderItemDB);
    const values = Object.values(updatedOrderItemDB);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${OrderItemDatabase.TABLE_ORDER_ITEMS}
      SET ${setClause}
      WHERE item_id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, item_id]);
  }

  public async deleteOrderItem(item_id: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      DELETE FROM ${OrderItemDatabase.TABLE_ORDER_ITEMS}
      WHERE item_id = ?
    `,
      [item_id]
    );
  }
}
