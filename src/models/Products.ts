export interface ProductDB {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
  category_id?: number;
  color_id?: number;
  size_id?: number;
  gender_id?: number;
}

export interface ProductDBOutput {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
  category?: string;
  color?: string;
  size?: string;
  gender?: string;
}

export class Product {
  constructor(
      private id: string,
      private name: string,
      private description: string | undefined,
      private price: number,
      private stock: number,
      private createdAt: string,
      private categoryId: number | undefined,
      private colorId: number | undefined,
      private sizeId: number | undefined,
      private genderId: number | undefined
  ) {}

  getId(): string {
      return this.id;
  }

  setId(id: string): void {
      this.id = id;
  }

  getName(): string {
      return this.name;
  }

  setName(name: string): void {
      this.name = name;
  }

  getDescription(): string | undefined {
      return this.description;
  }

  setDescription(description: string | undefined): void {
      this.description = description;
  }

  getPrice(): number {
      return this.price;
  }

  setPrice(price: number): void {
      this.price = price;
  }

  getStock(): number {
      return this.stock;
  }

  setStock(stock: number): void {
      this.stock = stock;
  }

  getCreatedAt(): string {
      return this.createdAt;
  }

  setCreatedAt(createdAt: string): void {
      this.createdAt = createdAt;
  }

  getCategoryId(): number | undefined {
      return this.categoryId;
  }

  setCategoryId(categoryId: number | undefined): void {
      this.categoryId = categoryId;
  }

  getColorId(): number | undefined {
      return this.colorId;
  }

  setColorId(colorId: number | undefined): void {
      this.colorId = colorId;
  }

  getSizeId(): number | undefined {
      return this.sizeId;
  }

  setSizeId(sizeId: number | undefined): void {
      this.sizeId = sizeId;
  }

  getGenderId(): number | undefined {
      return this.genderId;
  }

  setGenderId(genderId: number | undefined): void {
      this.genderId = genderId;
  }
}

export interface CategoryDB {
  id: number;
  name: string;
  description?: string;
}

export interface ColorDB {
  id: number;
  name: string;
}

export interface SizeDB {
  id: number;
  name: string;
}

export interface GenderDB {
  id: number;
  name: string;
}
