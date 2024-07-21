import { BaseDatabase } from "./connection/BaseDatabase";
import { CategoryDB, ColorDB, SizeDB, GenderDB, ProductDB } from "../models/Products";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "products";
  public static TABLE_CATEGORIES = "categories";
  public static TABLE_COLORS = "colors";
  public static TABLE_SIZES = "sizes";
  public static TABLE_GENDERS = "genders";

  // PRODUCT DATA

  public async findProducts(q?: string, category_id?: number, color_id?: number, size_id?: number, gender_id?: number) {
    let query = BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).select();

    if (q) {
      query = query.where("name", "LIKE", `%${q}%`);
    }
    if (category_id) {
      query = query.where({ category_id });
    }
    if (color_id) {
      query = query.where({ color_id });
    }
    if (size_id) {
      query = query.where({ size_id });
    }
    if (gender_id) {
      query = query.where({ gender_id });
    }

    const productsDB = await query;

    return productsDB;
  }

  public async findProductById(id: string) {
    const [productDB]: ProductDB[] | undefined[] = await BaseDatabase
      .connection(ProductDatabase.TABLE_PRODUCTS)
      .where({ id });

    return productDB;
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

  public async updateProduct(idToEdit: string, updatedProductDB: Partial<ProductDB>) {
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
