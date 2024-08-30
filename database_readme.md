# Database Documentation

## 1. **Database Creation**

```sql
CREATE DATABASE CLOTHING_DB;
```

## **Index**

1. [Users Table](#users-table)
2. [Phones Table](#phones-table)
3. [Order Status Table](#order-status-table)
4. [Orders Table](#orders-table)
5. [Order Items Table](#order-items-table)
6. [Categories Table](#categories-table)
7. [Colors Table](#colors-table)
8. [Sizes Table](#sizes-table)
9. [Genders Table](#genders-table)
10. [Products Table](#products-table)
11. [Product Images Table](#product-images-table)
12. [Wishlists Table](#wishlists-table)
13. [Wishlist Items Table](#wishlist-items-table)
14. [Tickets Table](#tickets-table)
15. [Ticket Status Table](#ticket-status-table)
16. [Ticket Types Table](#ticket-types-table)
17. [Orders Audit Table](#orders-audit-table)
18. [Order Items Audit Table](#order-items-audit-table)
19. [Products Audit Table](#products-audit-table)
20. [Users Audit Table](#users-audit-table)
21. [Phones Audit Table](#phones-audit-table)


## **2. **Tables**

### **Table: `users`**

- **Description**: Stores user information.
- **Columns**:
  - `id` (TEXT, PK, NOT NULL): Unique identifier for the user.
  - `personal_id` (TEXT, UNIQUE, NOT NULL): Unique personal identifier.
  - `entity_type` (TEXT, NOT NULL): Type of entity.
  - `name` (TEXT, NOT NULL): User's name.
  - `gender` (INTEGER): User's gender (references `genders` table).
  - `email` (TEXT, UNIQUE, NOT NULL): User's email.
  - `password` (TEXT, NOT NULL): User's password.
  - `role` (TEXT, NOT NULL): User's role.
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Account creation timestamp.
  - `birthdate` (DATE, NOT NULL): User's birthdate.
  - `address` (TEXT, NOT NULL): User's address.
  - `number` (TEXT, NOT NULL): Address number.
  - `neighborhood` (TEXT, NOT NULL): User's neighborhood.
  - `city` (TEXT, NOT NULL): User's city.
  - `country` (TEXT, NOT NULL): User's country.
  - `active` (BOOLEAN, DEFAULT TRUE): Account status.
  - `last_login` (TIMESTAMP): Last login timestamp.

- **Indexes**: 
  - `id` (Primary Key)
  - `email` (Unique)

- **Foreign Keys**:
  - `gender` references `genders(gender_id)`.

### **Table: `phones`**

- **Description**: Stores phone information associated with users.
- **Columns**:
  - `phone_id` (TEXT, PK, UNIQUE, NOT NULL): Unique phone identifier.
  - `user_id` (TEXT, NOT NULL): User ID (references `users` table).
  - `number` (TEXT, NOT NULL): Phone number.
  - `type` (TEXT, NOT NULL): Type of phone.

- **Foreign Keys**:
  - `user_id` references `users(id)`.

### **Table: `order_status`**

- **Description**: Stores the status of orders.
- **Columns**:
  - `status_id` (SERIAL, PK): Unique status identifier.
  - `status_name` (TEXT, NOT NULL): Status name.

- **Indexes**:
  - `status_id` (Primary Key)

### **Table: `orders`**

- **Description**: Stores order details.
- **Columns**:
  - `order_id` (TEXT, PK, UNIQUE, NOT NULL): Unique order identifier.
  - `user_id` (TEXT, NOT NULL): User ID (references `users` table).
  - `order_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Date of the order.
  - `status_id` (INTEGER, NOT NULL): Status ID (references `order_status` table).
  - `total` (NUMERIC(10, 2), NOT NULL): Total amount.
  - `tracking_code` (TEXT): Tracking code for the order.

- **Foreign Keys**:
  - `user_id` references `users(id)`.
  - `status_id` references `order_status(status_id)`.

### **Table: `order_items`**

- **Description**: Stores items in orders.
- **Columns**:
  - `id` (TEXT, PK, UNIQUE, NOT NULL): Unique item identifier.
  - `order_id` (TEXT, NOT NULL): Order ID (references `orders` table).
  - `product_id` (TEXT, NOT NULL): Product ID (references `products` table).
  - `quantity` (INTEGER, NOT NULL): Quantity of the product.
  - `price` (NUMERIC(10, 2), NOT NULL): Price of the product.

- **Foreign Keys**:
  - `order_id` references `orders(order_id)`.
  - `product_id` references `products(id)`.

### **Table: `categories`**

- **Description**: Stores product categories.
- **Columns**:
  - `category_id` (SERIAL, PK): Unique category identifier.
  - `name` (TEXT, NOT NULL): Category name.
  - `description` (TEXT): Description of the category.

- **Indexes**:
  - `category_id` (Primary Key)

### **Table: `colors`**

- **Description**: Stores colors used for products.
- **Columns**:
  - `color_id` (SERIAL, PK): Unique color identifier.
  - `name` (TEXT, NOT NULL): Color name.
  - `hex_code` (TEXT): Hex code for the color.

- **Indexes**:
  - `color_id` (Primary Key)

### **Table: `sizes`**

- **Description**: Stores sizes for products.
- **Columns**:
  - `size_id` (SERIAL, PK): Unique size identifier.
  - `name` (TEXT, NOT NULL): Size name.

- **Indexes**:
  - `size_id` (Primary Key)

### **Table: `genders`**

- **Description**: Stores gender options.
- **Columns**:
  - `gender_id` (SERIAL, PK): Unique gender identifier.
  - `name` (TEXT, NOT NULL): Gender name.

- **Indexes**:
  - `gender_id` (Primary Key)

### **Table: `products`**

- **Description**: Stores product information.
- **Columns**:
  - `id` (TEXT, PK, UNIQUE, NOT NULL): Unique product identifier.
  - `name` (TEXT, NOT NULL): Product name.
  - `description` (TEXT): Description of the product.
  - `price` (NUMERIC(10, 2), NOT NULL): Price of the product.
  - `stock` (INTEGER, NOT NULL): Stock quantity.
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the product was created.
  - `category_id` (INTEGER): Category ID (references `categories` table).
  - `color_id` (INTEGER): Color ID (references `colors` table).
  - `size_id` (INTEGER): Size ID (references `sizes` table).
  - `gender_id` (INTEGER): Gender ID (references `genders` table).
  - `active` (BOOLEAN, DEFAULT TRUE): Whether the product is active.

- **Foreign Keys**:
  - `category_id` references `categories(category_id)`.
  - `color_id` references `colors(color_id)`.
  - `size_id` references `sizes(size_id)`.
  - `gender_id` references `genders(gender_id)`.

### **Table: `product_images`**

- **Description**: Stores images for products.
- **Columns**:
  - `id` (TEXT, PK): Unique image identifier.
  - `product_id` (TEXT, NOT NULL): Product ID (references `products` table).
  - `url` (TEXT, NOT NULL): URL of the image.
  - `alt` (TEXT): Alt text for the image.

- **Foreign Keys**:
  - `product_id` references `products(id)`.

### **Table: `wishlists`**

- **Description**: Stores user wishlists.
- **Columns**:
  - `wishlist_id` (TEXT, PK): Unique wishlist identifier.
  - `user_id` (TEXT, NOT NULL): User ID (references `users` table).
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the wishlist was created.

- **Foreign Keys**:
  - `user_id` references `users(id)`.

### **Table: `wishlist_items`**

- **Description**: Stores items in wishlists.
- **Columns**:
  - `wishlist_id` (TEXT, NOT NULL): Wishlist ID (references `wishlists` table).
  - `product_id` (TEXT, NOT NULL): Product ID (references `products` table).

- **Primary Key**: 
  - Composite key (`wishlist_id`, `product_id`)

- **Foreign Keys**:
  - `wishlist_id` references `wishlists(wishlist_id)`.
  - `product_id` references `products(id)`.

### **Table: `tickets`**

- **Description**: Stores support tickets.
- **Columns**:
  - `id` (TEXT, PK): Unique ticket identifier.
  - `user_id` (TEXT, NOT NULL): User ID (references `users` table).
  - `type_id` (INTEGER): Type ID (references `ticket_types` table).
  - `user_name` (TEXT, NOT NULL): Name of the user.
  - `user_email` (TEXT, NOT NULL): Email of the user.
  - `user_phone_number` (TEXT, NOT NULL): Phone number of the user.
  - `description` (TEXT, NOT NULL): Description of the issue.
  - `solution` (TEXT): Solution to the issue.
  - `analist_name` (TEXT): Name of the analyst.
  - `analist_email` (TEXT): Email of the analyst.
  - `status_id` (INTEGER): Status ID (references `ticket_status` table).
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp when the ticket was created.
  - `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp when the ticket was last updated.

- **Foreign Keys**:
  - `user_id`

 references `users(id)`.
  - `type_id` references `ticket_types(type_id)`.
  - `status_id` references `ticket_status(status_id)`.

### **Table: `ticket_status`**

- **Description**: Stores ticket statuses.
- **Columns**:
  - `status_id` (SERIAL, PK): Unique status identifier.
  - `status_name` (TEXT, NOT NULL): Status name.

- **Indexes**:
  - `status_id` (Primary Key)

### **Table: `ticket_types`**

- **Description**: Stores types of support tickets.
- **Columns**:
  - `type_id` (SERIAL, PK): Unique type identifier.
  - `type_name` (TEXT, NOT NULL): Type name.

- **Indexes**:
  - `type_id` (Primary Key)

### **Table: `orders_audit`**

- **Description**: Stores audit logs for orders.
- **Columns**:
  - `id` (SERIAL, PK): Unique audit log identifier.
  - `order_id` (TEXT, NOT NULL): Order ID (references `orders` table).
  - `action` (TEXT, NOT NULL): Action performed.
  - `performed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the action was performed.
  - `performed_by` (TEXT, NOT NULL): User who performed the action.

- **Foreign Keys**:
  - `order_id` references `orders(order_id)`.

### **Table: `order_items_audit`**

- **Description**: Stores audit logs for order items.
- **Columns**:
  - `id` (SERIAL, PK): Unique audit log identifier.
  - `order_item_id` (TEXT, NOT NULL): Order Item ID (references `order_items` table).
  - `action` (TEXT, NOT NULL): Action performed.
  - `performed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the action was performed.
  - `performed_by` (TEXT, NOT NULL): User who performed the action.

- **Foreign Keys**:
  - `order_item_id` references `order_items(id)`.

### **Table: `products_audit`**

- **Description**: Stores audit logs for products.
- **Columns**:
  - `id` (SERIAL, PK): Unique audit log identifier.
  - `product_id` (TEXT, NOT NULL): Product ID (references `products` table).
  - `action` (TEXT, NOT NULL): Action performed.
  - `performed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the action was performed.
  - `performed_by` (TEXT, NOT NULL): User who performed the action.

- **Foreign Keys**:
  - `product_id` references `products(id)`.

### **Table: `users_audit`**

- **Description**: Stores audit logs for users.
- **Columns**:
  - `id` (SERIAL, PK): Unique audit log identifier.
  - `user_id` (TEXT, NOT NULL): User ID (references `users` table).
  - `action` (TEXT, NOT NULL): Action performed.
  - `performed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the action was performed.
  - `performed_by` (TEXT, NOT NULL): User who performed the action.

- **Foreign Keys**:
  - `user_id` references `users(id)`.

### **Table: `phones_audit`**

- **Description**: Stores audit logs for phones.
- **Columns**:
  - `id` (SERIAL, PK): Unique audit log identifier.
  - `phone_id` (TEXT, NOT NULL): Phone ID (references `phones` table).
  - `action` (TEXT, NOT NULL): Action performed.
  - `performed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP, NOT NULL): Timestamp when the action was performed.
  - `performed_by` (TEXT, NOT NULL): User who performed the action.

- **Foreign Keys**:
  - `phone_id` references `phones(phone_id)`.
