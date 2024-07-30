export interface ProductDB {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
  category_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
}

export interface ProductDBOutput {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string | number;
  category: string | number;
  color: string | number;
  size: string | number;
  gender: string | number;
}

export class Product {
  constructor(
      private id: string,
      private name: string,
      private description: string | undefined,
      private price: number,
      private stock: number,
      private createdAt: string,
      private category: number | string,
      private color: number | string,
      private size: number | string,
      private gender: number | string
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

  getCategory(): number | string {
      return this.category;
  }

  setCategory(category: number | string): void {
      this.category = category;
  }

  getColor(): number | string {
      return this.color;
  }

  setColor(color: number | string): void {
      this.color = color;
  }

  getSize(): number | string {
      return this.size;
  }

  setSize(size: number | string): void {
      this.size = size;
  }

  getGender(): number | string {
      return this.gender;
  }

  setGender(gender: number | string): void {
      this.gender = gender;
  }
}

export interface CategoryDB {
    name: string;
    description?: string;
  }
  
  export interface ColorDB {
    color: string;
  }
  
  export interface SizeDB {
    name: string;
  }
  
  export interface GenderDB {
    name: string;
  }
  