import { BaseDatabase } from "./connection/BaseDatabase";
import {
  CategoryDB,
  ColorDB,
  SizeDB,
  GenderDB,
  ProductDB,
} from "../models/Products";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "products";
  public static TABLE_CATEGORIES = "categories";
  public static TABLE_COLORS = "colors";
  public static TABLE_SIZES = "sizes";
  public static TABLE_GENDERS = "genders";

  // PRODUCT DATA

  public async findProducts(
    name?: string,
    category_id?: number,
    color_id?: number,
    size_id?: number,
    gender_id?: number
  ) {
    let conditions: string[] = [];
    let params: any[] = [];

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
        genders.name AS gender
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

  // public async insertProduct(newProductDB: ProductDB) {
  //   await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).insert(
  //     newProductDB
  //   );
  // }

  public async insertProduct(newProductDB: ProductDB) {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${ProductDatabase.TABLE_PRODUCTS} 
      (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        newProductDB.id,
        newProductDB.name,
        newProductDB.description,
        newProductDB.price,
        newProductDB.stock,
        newProductDB.created_at,
        newProductDB.category_id,
        newProductDB.color_id,
        newProductDB.size_id,
        newProductDB.gender_id,
      ]
    );
  }

  // public async updateProduct(idToEdit: string, updatedProductDB: ProductDB) {
  //   console.log(updatedProductDB);
  //   await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
  //     .update(updatedProductDB)
  //     .where({ id: idToEdit });
  // }

  public async updateProduct(idToEdit: string, updatedProductDB: ProductDB) {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${ProductDatabase.TABLE_PRODUCTS}
      SET name = ?, description = ?, price = ?, stock = ?, created_at = ?, category_id = ?, color_id = ?, size_id = ?, gender_id = ?
      WHERE id = ?
    `,
      [
        updatedProductDB.name,
        updatedProductDB.description,
        updatedProductDB.price,
        updatedProductDB.stock,
        updatedProductDB.created_at,
        updatedProductDB.category_id,
        updatedProductDB.color_id,
        updatedProductDB.size_id,
        updatedProductDB.gender_id,
        idToEdit,
      ]
    );
  }

  // CATEGORY DATA

  public async findCategories() {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_CATEGORIES}
    `);

    return result[0];
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

    return result[0];
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

    return result[0];
  }

  public async insertCategory(newCategoryDB: CategoryDB) {
    const { name, description } = newCategoryDB;

    await BaseDatabase.connection.raw(
      `
    INSERT INTO ${ProductDatabase.TABLE_CATEGORIES} (name, description)
    VALUES (?, ?)
  `,
      [name, description]
    );
  }

  // public async updateCategory(
  //   category_id: string,
  //   updatedCategoryDB: CategoryDB
  // ) {
  //   await BaseDatabase.connection(ProductDatabase.TABLE_CATEGORIES)
  //     .update(updatedCategoryDB)
  //     .where({ category_id });
  // }

  public async updateCategory(
    category_id: string,
    updatedCategoryDB: CategoryDB
  ) {
    await BaseDatabase.connection.raw(
      `
        UPDATE ${ProductDatabase.TABLE_CATEGORIES}
        SET name = ?, description = ?
        WHERE category_id = ?
    `,
      [updatedCategoryDB.name, updatedCategoryDB.description, category_id]
    );
  }

  // COLOR DATA

  public async findColors(): Promise<ColorDB[]> {
    const result = await BaseDatabase.connection.raw(`
        SELECT *
        FROM ${ProductDatabase.TABLE_COLORS}
    `);

    return result[0];
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

    return result[0];
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

    return result[0];
  }

  public async insertColor(newColorDB: ColorDB) {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${ProductDatabase.TABLE_COLORS} (name)
      VALUES (?)
    `,
      [newColorDB.name]
    );
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

  // SIZE DATA

  public async findSizes(): Promise<SizeDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_SIZES}
    `);

    return result[0];
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

  // GENDER DATA

  public async findGenders(): Promise<GenderDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_GENDERS}
    `);

    return result[0];
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

    return result[0];
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

    return result[0];
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
