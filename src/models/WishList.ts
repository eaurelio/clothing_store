export interface WishlistDB {
  id: string;
  user_id: string;
  createdAt: string; // Alterado para string
  items: WishlistItemDB[]
}

export interface WishlistItemDB {
  wishlist_id: string;
  product_id: string;
}

export interface WishlistDBOutput {
  id: string;
  userId: string;
  createdAt: string | number;
  items: WishlistItemDB[];
}

export interface WishlistItemDBOutput {
  wishlistId: string;
  productId: string;
}

export class Wishlist {
  constructor(
    private id: string,
    private userId: string,
    private createdAt: string
  ) {}

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  setCreatedAt(createdAt: string): void {
    this.createdAt = createdAt;
  }
}

export class WishlistItem {
  constructor(
    private wishlistId: string,
    private productId: string
  ) {}

  getWishlistId(): string {
    return this.wishlistId;
  }

  setWishlistId(wishlistId: string): void {
    this.wishlistId = wishlistId;
  }

  getProductId(): string {
    return this.productId;
  }

  setProductId(productId: string): void {
    this.productId = productId;
  }
}