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
import { ProductImageDB } from "../models/ProductImage";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "products";
  public static TABLE_CATEGORIES = "categories";
  public static TABLE_COLORS = "colors";
  public static TABLE_SIZES = "sizes";
  public static TABLE_GENDERS = "genders";
  public static TABLE_IMAGES = "product_images";

  public async findProducts(
    id?: string,
    name?: string,
    category_id?: number,
    color_id?: number,
    size_id?: number,
    gender_id?: number,
    active?: boolean
  ) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (id) {
      conditions.push("products.id = ?");
      params.push(`${id}`);
    }

    if (name) {
      conditions.push("products.name ILIKE ?");
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
        categories.category_id,
        categories.name AS category, 
        colors.color_id,
        colors.name AS color, 
        sizes.size_id,
        sizes.name AS size,
        genders.gender_id,
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

    return result.rows;
  }

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

    return result.rows[0];
  }

  public async findPureProductById(id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      WHERE products.id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  public async findProductByName(name: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      WHERE name = ?
    `,
      [name]
    );

    return result.rows[0];
  }

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

  public async getImageById(
    imageId: string
  ): Promise<ProductImageDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_IMAGES}
      WHERE id = ?
    `,
      [imageId]
    );

    return result.rows[0];
  }

  public async getImagesByProductId(
    productId: string
  ): Promise<ProductImageDB[]> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_IMAGES}
      WHERE product_id = ?
    `,
      [productId]
    );

    return result.rows;
  }

  public async getImageByUrl(url: string): Promise<ProductImageDB[]> {
    const result = await BaseDatabase.connection.raw(
      `
        SELECT *
        FROM ${ProductDatabase.TABLE_IMAGES}
        WHERE url = ?
      `,
      [url]
    );

    return result.rows[0];
  }

  public async insertProductImage(imageData: ProductImageDB): Promise<void> {
    const columns = Object.keys(imageData);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(imageData);

    const query = `
      INSERT INTO ${ProductDatabase.TABLE_IMAGES} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async deleteProductImage(imageId: string): Promise<void> {
    const query = `
      DELETE FROM ${ProductDatabase.TABLE_IMAGES}
      WHERE id = ?
    `;

    await BaseDatabase.connection.raw(query, [imageId]);
  }

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

  public async updateProductActiveStatus(
    productId: string,
    active: boolean
  ): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE products
      SET active = ?
      WHERE id = ?
    `,
      [active, productId]
    );
  }

  public async getAllCategories(): Promise<CategoryDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
    `);

    return result.rows;
  }

  public async findCategoryById(category_id: string) {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
      WHERE category_id = ?
    `,
      [category_id]
    );

    return result.rows[0];
  }

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

    return result.rows[0];
  }

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

  public async getAllColors(): Promise<ColorDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
        SELECT *
        FROM ${ProductDatabase.TABLE_COLORS}
    `);

    return result.rows;
  }

  public async findColorById(color_id: string): Promise<ColorDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_COLORS}
      WHERE color_id = ?
    `,
      [color_id]
    );

    return result.rows[0];
  }

  public async findColorByName(name: string): Promise<ColorDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_COLORS}
      WHERE name = ?
  `,
      [name]
    );

    return result.rows[0];
  }

  public async insertColor(newColorDB: ColorDB) {
    const fields = Object.keys(newColorDB);
    const values = Object.values(newColorDB);

    const placeholders = fields.map(() => "?").join(", ");

    const query = `
    INSERT INTO ${ProductDatabase.TABLE_COLORS} (${fields.join(", ")})
    VALUES (${placeholders})
  `;

    await BaseDatabase.connection.raw(query, values);
  }

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

  public async getAllSizes(): Promise<SizeDBOutput[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_SIZES}
    `);

    return result.rows;
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

    return result.rows[0];
  }

  public async findSizeByName(name: string): Promise<SizeDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
    SELECT *
    FROM ${ProductDatabase.TABLE_SIZES}
    WHERE name = ?
  `,
      [name]
    );

    return result.rows[0];
  }

  public async insertSize(newSizeDB: SizeDB) {
    await BaseDatabase.connection.raw(
      `
    INSERT INTO ${ProductDatabase.TABLE_SIZES} (name)
    VALUES (?)
  `,
      [newSizeDB.name]
    );
  }

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

  public async getAllGenders(): Promise<GenderDBOutPut[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
    `);

    return result.rows;
  }

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

    return result.rows[0];
  }

  public async findGenderByName(name: string): Promise<GenderDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
      WHERE name = ?
    `,
      [name]
    );

    return result.rows[0];
  }

  public async insertGender(newGenderDB: Omit<GenderDB, "gender_id">) {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${ProductDatabase.TABLE_GENDERS} (name)
      VALUES (?)
    `,
      [newGenderDB.name]
    );
  }

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
