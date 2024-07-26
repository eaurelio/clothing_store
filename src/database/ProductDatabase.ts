import { BaseDatabase } from "./connection/BaseDatabase";
import { CategoryDB, ColorDB, SizeDB, GenderDB, ProductDB } from "../models/Products";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "products";
  public static TABLE_CATEGORIES = "categories";
  public static TABLE_COLORS = "colors";
  public static TABLE_SIZES = "sizes";
  public static TABLE_GENDERS = "genders";

  // PRODUCT DATA

  public async findProducts(name?: string, category_id?: number, color_id?: number, size_id?: number, gender_id?: number) {
    let conditions: string[] = [];
    let params: any[] = [];

    // Adiciona condições ao array se os parâmetros forem fornecidos
    if (name) {
        conditions.push('products.name LIKE ?');
        params.push(`%${name}%`);
    }
    if (category_id) {
        conditions.push('products.category_id = ?');
        params.push(category_id);
    }
    if (color_id) {
        conditions.push('products.color_id = ?');
        params.push(color_id);
    }
    if (size_id) {
        conditions.push('products.size_id = ?');
        params.push(size_id);
    }
    if (gender_id) {
        conditions.push('products.gender_id = ?');
        params.push(gender_id);
    }

    // Se não houver condições, a cláusula WHERE será uma string vazia
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Executa a consulta SQL
    const result = await BaseDatabase.connection.raw(`
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
    `, params);

    return result;
}

  public async findProductById(id: string) {
    const result = await BaseDatabase.connection.raw(`
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
    `, [id]);

    return result[0];
  }

  public async findPureProductById(id: string) {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${ProductDatabase.TABLE_PRODUCTS}
      WHERE products.id = ?
    `, [id]);

    return result[0];
  }

  public async findProductByName(name: string) {
    const [productDB]: ProductDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_PRODUCTS)
      .where({ name });

    return productDB;
  }

  public async insertProduct(newProductDB: ProductDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_PRODUCTS)
      .insert(newProductDB);
  }

  public async updateProduct(idToEdit: string, updatedProductDB: ProductDB) {
    console.log(updatedProductDB)
    await BaseDatabase
      .connection(ProductDatabase.TABLE_PRODUCTS)
      .update(updatedProductDB)
      .where({ id: idToEdit });
  }

  public async deleteProductById(id: string) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_PRODUCTS)
      .where({ id })
      .delete();
  }

  // CATEGORY DATA

  public async findCategories() {
    const result: CategoryDB[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES);

    return result;
  }

  public async findCategoryById(id: number) {
    const [categoryDB]: CategoryDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES)
      .where({ id });

    return categoryDB;
  }

  public async findCategoryByName(name: string) {
    const [categoryDB]: CategoryDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES)
      .where({ name })
      .first();

    return categoryDB;
  }

  public async insertCategory(newCategoryDB: CategoryDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES)
      .insert(newCategoryDB);
  }

  public async updateCategory(idToEdit: number, updatedCategoryDB: CategoryDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES)
      .update(updatedCategoryDB)
      .where({ id: idToEdit });
  }

  public async deleteCategoryById(id: number) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_CATEGORIES)
      .where({ id })
      .delete();
  }

  // COLOR DATA

  public async findColors() {
    const result: ColorDB[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS);

    return result;
  }

  public async findColorById(id: number) {
    const [colorDB]: ColorDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS)
      .where({ id });

    return colorDB;
  }

  public async findColorByName(name: string) {
    const [colorDB]: ColorDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS)
      .where({ name })
      .first();

    return colorDB;
  }

  public async insertColor(newColorDB: ColorDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS)
      .insert(newColorDB);
  }

  public async updateColor(idToEdit: number, updatedColorDB: ColorDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS)
      .update(updatedColorDB)
      .where({ id: idToEdit });
  }

  public async deleteColorById(id: number) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_COLORS)
      .where({ id })
      .delete();
  }

  // SIZE DATA

  public async findSizes() {
    const result: SizeDB[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES);

    return result;
  }

  public async findSizeById(id: number) {
    const [sizeDB]: SizeDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES)
      .where({ id });

    return sizeDB;
  }

  public async findSizeByName(name: string) {
    const [sizeDB]: SizeDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES)
      .where({ name })
      .first();

    return sizeDB;
  }

  public async insertSize(newSizeDB: SizeDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES)
      .insert(newSizeDB);
  }

  public async updateSize(idToEdit: number, updatedSizeDB: SizeDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES)
      .update(updatedSizeDB)
      .where({ id: idToEdit });
  }

  public async deleteSizeById(id: number) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_SIZES)
      .where({ id })
      .delete();
  }

  // GENDER DATA

  public async findGenders() {
    const result: GenderDB[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS);

    return result;
  }

  public async findGenderById(id: number) {
    const [genderDB]: GenderDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS)
      .where({ id });

    return genderDB;
  }

  public async findGenderByName(name: string) {
    const [genderDB]: GenderDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS)
      .where({ name })
      .first();

    return genderDB;
  }

  public async insertGender(newGenderDB: GenderDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS)
      .insert(newGenderDB);
  }

  public async updateGender(idToEdit: number, updatedGenderDB: GenderDB) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS)
      .update(updatedGenderDB)
      .where({ id: idToEdit });
  }

  public async deleteGenderById(id: number) {
    await BaseDatabase
      .connection(ProductDatabase.TABLE_GENDERS)
      .where({ id })
      .delete();
  }
}