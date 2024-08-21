export interface WishlistDB {
  wishlist_id: string;
  user_id: string;
  created_at: string;
  items?: WishlistItemDB[];
}

export interface WishlistDBInput {
  wishlist_id: string;
  user_id: string;
  created_at: string;
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
    private wishlist_id: string,
    private userId: string,
    private createdAt: string
  ) {}

  getId(): string {
    return this.wishlist_id;
  }

  setId(id: string): void {
    this.wishlist_id = id;
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