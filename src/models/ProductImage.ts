export interface ProductImageDB {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
}

export interface ProductImageDBInput {
  product_id: string;
  url: string;
  alt?: string;
}

export interface ProductImageOutput {
  message: string,
  images: ProductImageDB[]
}

export interface ProductImageDBOutput {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
}

export class ProductImage {
  constructor(
      private id: string,
      private productId: string,
      private url: string,
      private alt?: string
  ) {}

  getId(): string {
      return this.id;
  }

  setId(id: string): void {
      this.id = id;
  }

  getProductId(): string {
      return this.productId;
  }

  setProductId(productId: string): void {
      this.productId = productId;
  }

  getUrl(): string {
      return this.url;
  }

  setUrl(url: string): void {
      this.url = url;
  }

  getAlt(): string | undefined {
      return this.alt;
  }

  setAlt(alt: string): void {
      this.alt = alt;
  }
}
