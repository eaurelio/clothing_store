import { BaseDatabase } from "./connection/BaseDatabase";
import {
  CategoryDB,
  ColorDB,
  SizeDB,
  GenderDB,
  ProductDB,
  GenderDBOutPut,
  SizeDBOutput,
  ColorDBOutput,
  CategoryDBOutput,
} from "../models/Products";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "products";
  public static TABLE_CATEGORIES = "categories";
  public static TABLE_COLORS = "colors";
  public static TABLE_SIZES = "sizes";
  public static TABLE_GENDERS = "genders";

  // PRODUCT DATA

  public async findProducts(
    id?: string,
    name?: string,
    category_id?: number,
    color_id?: number,
    size_id?: number,
    gender_id?: number,
    active?: boolean
  ) {
    let conditions: string[] = [];
    let params: any[] = [];

    if (id) {
      conditions.push("products.id = ?");
      params.push(`${id}`);
    }
  
    if (name) {
      conditions.push("products.name LIKE ?");
      params.push(`%${name}%`);
    }
    if (category_id) {
      conditions.push("products.category_id = ?");
      params.push(category_id);
    }
    if (color_id) {
      conditions.push("products.color_id = ?");
      params.push(color_id);
    }
    if (size_id) {
      conditions.push("products.size_id = ?");
      params.push(size_id);
    }
    if (gender_id) {
      conditions.push("products.gender_id = ?");
      params.push(gender_id);
    }

    conditions.push("products.active = ?");
    params.push(active);

  
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        products.id, 
        products.name, 
        products.description, 
        products.price, 
        products.stock, 
        products.created_at, 
        categories.name AS category, 
        colors.name AS color, 
        sizes.name AS size, 
        genders.name AS gender,
        products.active
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      LEFT JOIN categories ON products.category_id = categories.category_id
      LEFT JOIN colors ON products.color_id = colors.color_id
      LEFT JOIN sizes ON products.size_id = sizes.size_id
      LEFT JOIN genders ON products.gender_id = genders.gender_id
      ${whereClause}
    `,
      params
    );
  
    return result;
  }
  

  // --------------------------------------------------------------------

  public async findProductById(id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        products.id, 
        products.name, 
        products.description, 
        products.price, 
        products.stock, 
        products.created_at, 
        categories.name AS category, 
        colors.name AS color, 
        sizes.name AS size, 
        genders.name AS gender
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      LEFT JOIN categories ON products.category_id = categories.category_id
      LEFT JOIN colors ON products.color_id = colors.color_id
      LEFT JOIN sizes ON products.size_id = sizes.size_id
      LEFT JOIN genders ON products.gender_id = genders.gender_id
      WHERE products.id = ?
    `,
      [id]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async findPureProductById(id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      WHERE products.id = ?
    `,
      [id]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async findProductByName(name: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      WHERE name = ?
    `,
      [name]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async insertProduct(newProductDB: ProductDB): Promise<void> {
    const columns = Object.keys(newProductDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newProductDB);

    const query = `
      INSERT INTO ${ProductDatabase.TABLE_PRODUCTS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  // --------------------------------------------------------------------

  public async updateProduct(
    idToEdit: string,
    updatedProductDB: Partial<ProductDB>
  ): Promise<void> {
    const columns = Object.keys(updatedProductDB);
    const values = Object.values(updatedProductDB);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${ProductDatabase.TABLE_PRODUCTS}
      SET ${setClause}
      WHERE id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, idToEdit]);
  }

  // --------------------------------------------------------------------

  public async updateProductActiveStatus(productId: string, active: boolean): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE products
      SET active = ?
      WHERE id = ?
    `,
      [active, productId]
    );
}


  // --------------------------------------------------------------------
  // CATEGORY DATA
  // --------------------------------------------------------------------

  public async getAllCategories(): Promise<CategoryDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
    `);

    return result;
  }

  // --------------------------------------------------------------------

  public async findCategoryById(category_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
      WHERE category_id = ?
    `,
      [category_id]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async findCategoryByName(
    name: string
  ): Promise<CategoryDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
      WHERE name = ?
    `,
      [name]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async insertCategory(newCategoryDB: CategoryDB): Promise<void> {
    const columns = Object.keys(newCategoryDB);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(newCategoryDB);

    const query = `
      INSERT INTO ${ProductDatabase.TABLE_CATEGORIES} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  // --------------------------------------------------------------------

  public async updateCategory(
    category_id: string,
    updatedCategoryDB: Partial<CategoryDB>
  ): Promise<void> {
    const columns = Object.keys(updatedCategoryDB);
    const values = Object.values(updatedCategoryDB);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${ProductDatabase.TABLE_CATEGORIES}
      SET ${setClause}
      WHERE category_id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, category_id]);
  }

  // --------------------------------------------------------------------
  // COLOR DATA
  // --------------------------------------------------------------------

  public async getAllColors(): Promise<ColorDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
        SELECT *
        FROM ${ProductDatabase.TABLE_COLORS}
    `);

    return result;
  }

  // --------------------------------------------------------------------

  public async findColorById(color_id: string): Promise<ColorDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_COLORS}
      WHERE color_id = ?
    `,
      [color_id]
    );

    return result[0];
  }

// --------------------------------------------------------------------

  public async findColorByName(name: string): Promise<ColorDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_COLORS}
      WHERE name = ?
  `,
      [name]
    );

    return result[0];
  }

// --------------------------------------------------------------------

public async insertColor(newColorDB: ColorDB) {
  const fields = Object.keys(newColorDB);
  const values = Object.values(newColorDB);

  const placeholders = fields.map(() => '?').join(', ');

  const query = `
    INSERT INTO ${ProductDatabase.TABLE_COLORS} (${fields.join(', ')})
    VALUES (${placeholders})
  `;

  await BaseDatabase.connection.raw(query, values);
}


  // --------------------------------------------------------------------

  public async updateColor(color_id: string, updatedColorDB: ColorDB) {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${ProductDatabase.TABLE_COLORS}
      SET name = ?
      WHERE color_id = ?
    `,
      [updatedColorDB.name, color_id]
    );
  }

  // SIZE DATA

  public async getAllSizes(): Promise<SizeDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_SIZES}
    `);

    return result;
  }

  public async findSizeById(size_id: string): Promise<SizeDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
    SELECT *
    FROM ${ProductDatabase.TABLE_SIZES}
    WHERE size_id = ?
  `,
      [size_id]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async findSizeByName(name: string): Promise<SizeDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
    SELECT *
    FROM ${ProductDatabase.TABLE_SIZES}
    WHERE name = ?
  `,
      [name]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async insertSize(newSizeDB: SizeDB) {
    await BaseDatabase.connection.raw(
      `
    INSERT INTO ${ProductDatabase.TABLE_SIZES} (name)
    VALUES (?)
  `,
      [newSizeDB.name]
    );
  }

  // --------------------------------------------------------------------

  public async updateSize(size_id: string, updatedSizeDB: SizeDB) {
    await BaseDatabase.connection.raw(
      `
    UPDATE ${ProductDatabase.TABLE_SIZES}
    SET name = ?
    WHERE size_id = ?
  `,
      [updatedSizeDB.name, size_id]
    );
  }

  // --------------------------------------------------------------------
  // GENDER DATA
  // --------------------------------------------------------------------

  public async getAllGenders(): Promise<GenderDBOutPut[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
    `);

    return result;
  }

  // --------------------------------------------------------------------

  public async findGenderById(
    gender_id: string
  ): Promise<GenderDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
      WHERE gender_id = ?
    `,
      [gender_id]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async findGenderByName(name: string): Promise<GenderDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
      WHERE name = ?
    `,
      [name]
    );

    return result[0];
  }

  // --------------------------------------------------------------------

  public async insertGender(newGenderDB: Omit<GenderDB, "gender_id">) {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${ProductDatabase.TABLE_GENDERS} (name)
      VALUES (?)
    `,
      [newGenderDB.name]
    );
  }

  // --------------------------------------------------------------------

  public async updateGender(gender_id: string, updatedGenderDB: GenderDB) {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${ProductDatabase.TABLE_GENDERS}
      SET name = ?
      WHERE gender_id = ?
    `,
      [updatedGenderDB.name, gender_id]
    );
  }
}
