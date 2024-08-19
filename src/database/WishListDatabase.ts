import { BaseDatabase } from "./connection/BaseDatabase";
import { WishlistDB, WishlistDBInput } from "../models/WishList";
import { WishlistItemDB } from "../models/WishList";

export class WishlistDatabase extends BaseDatabase {
  public static TABLE_WISHLISTS = "wishlists";
  public static TABLE_WISHLIST_ITEMS = "wishlist_items";

  // WISHLIST DATA

  public async findWishlistById(wishlist_id: string): Promise<WishlistDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        wishlist_id, 
        user_id, 
        created_at AS createdAt
      FROM ${WishlistDatabase.TABLE_WISHLISTS}
      WHERE wishlist_id = ?
      `,
      [wishlist_id]
    );
  
    return result[0];
  }

  public async findWishlistByUserId(user_id: string): Promise<WishlistDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        wishlist_id, 
        user_id, 
        created_at AS createdAt
      FROM ${WishlistDatabase.TABLE_WISHLISTS}
      WHERE user_id = ?
      `,
      [user_id]
    );
  
    return result[0];
  }
  
  

  // --------------------------------------------------------------------

  public async insertWishlist(newWishlistDB: WishlistDBInput): Promise<void> {
    const columns = Object.keys(newWishlistDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newWishlistDB);
  
    const query = `
      INSERT INTO ${WishlistDatabase.TABLE_WISHLISTS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;
  
    await BaseDatabase.connection.raw(query, values);
  }
  

  // --------------------------------------------------------------------

  public async updateWishlist(
    wishlist_id: string,
    updatedWishlistDB: Partial<WishlistDB>
  ): Promise<void> {
    const columns = Object.keys(updatedWishlistDB);
    const values = Object.values(updatedWishlistDB);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${WishlistDatabase.TABLE_WISHLISTS}
      SET ${setClause}
      WHERE wishlist_id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, wishlist_id]);
  }

  // --------------------------------------------------------------------

  public async findWishlistItemsByWishlistId(wishlist_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${WishlistDatabase.TABLE_WISHLIST_ITEMS}
      WHERE wishlist_id = ?
    `,
      [wishlist_id]
    );

    return result;
  }

  // --------------------------------------------------------------------

  public async insertWishlistItem(newWishlistItemDB: WishlistItemDB): Promise<void> {
    const columns = Object.keys(newWishlistItemDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newWishlistItemDB);

    const query = `
      INSERT INTO ${WishlistDatabase.TABLE_WISHLIST_ITEMS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  // --------------------------------------------------------------------

  public async deleteWishlistItemsByWishlistId(wishlist_id: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      DELETE FROM ${WishlistDatabase.TABLE_WISHLIST_ITEMS}
      WHERE wishlist_id = ?
    `,
      [wishlist_id]
    );
  }

  // --------------------------------------------------------------------

  public async deleteWishlist(user_id: string): Promise<void> {
    const query = `
    DELETE FROM ${WishlistDatabase.TABLE_WISHLISTS}
    WHERE user_id = ?
  `;
    await BaseDatabase.connection.raw(query, [user_id]);
  }
}
