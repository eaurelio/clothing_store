drop table wishlist_items;

CREATE TABLE wishlists (
  wishlist_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wishlist_items (
  -- wishlist_item_id TEXT PRIMARY KEY,
  wishlist_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
