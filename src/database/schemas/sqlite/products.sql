-- Active: 1724253606382@@127.0.0.1@3306
drop table categories;
drop table colors;
drop table sizes;
drop table genders;
drop table products;

-- Table Categories
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Table Colors
CREATE TABLE colors (
    color_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

ALTER TABLE colors
ADD COLUMN hex_code TEXT;


-- Table Sizes
CREATE TABLE sizes (
    size_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Table Genders
CREATE TABLE genders (
    gender_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Table Products

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER,
    color_id INTEGER,
    size_id INTEGER,
    gender_id INTEGER,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (color_id) REFERENCES colors(color_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id),
    FOREIGN KEY (gender_id) REFERENCES genders(gender_id)
);

pragma table_info(products);

//------------------------------------------------------------------------------------------------------------------

-- Insert data into Categories
INSERT INTO categories (name, description) VALUES ('T-Shirts', 'Casual and comfortable T-shirts');
INSERT INTO categories (name, description) VALUES ('Jeans', 'Denim jeans for all occasions');
INSERT INTO categories (name, description) VALUES ('Jackets', 'Warm and stylish jackets');
INSERT INTO categories (name, description) VALUES ('Sweaters', 'Cozy sweaters for chilly weather');
INSERT INTO categories (name, description) VALUES ('Shorts', 'Lightweight shorts for summer');
INSERT INTO categories (name, description) VALUES ('Hats', 'Fashionable hats for all seasons');
INSERT INTO categories (name, description) VALUES ('Shoes', 'Comfortable and stylish shoes');

-- Insert data into Colors
INSERT INTO colors (name) VALUES ('Red');
INSERT INTO colors (name) VALUES ('Blue');
INSERT INTO colors (name) VALUES ('Green');
INSERT INTO colors (name) VALUES ('Black');
INSERT INTO colors (name) VALUES ('White');
INSERT INTO colors (name) VALUES ('Yellow');
INSERT INTO colors (name) VALUES ('Gray');
INSERT INTO colors (name) VALUES ('Purple');
INSERT INTO colors (name) VALUES ('Orange');
INSERT INTO colors (name) VALUES ('Pink');

-- ----------------------------------------------------------------------------------------------------------------

PRAGMA foreign_keys=off;

drop table colors;

CREATE TABLE colors (
    color_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

ALTER TABLE colors
ADD COLUMN hex_code TEXT;

PRAGMA foreign_keys=on;

INSERT INTO colors (name, hex_code) VALUES ('Red', '#FF0000');
INSERT INTO colors (name, hex_code) VALUES ('Blue', '#0000FF');
INSERT INTO colors (name, hex_code) VALUES ('Green', '#00FF00');
INSERT INTO colors (name, hex_code) VALUES ('Black', '#000000');
INSERT INTO colors (name, hex_code) VALUES ('White', '#FFFFFF');
INSERT INTO colors (name, hex_code) VALUES ('Yellow', '#FFFF00');
INSERT INTO colors (name, hex_code) VALUES ('Gray', '#808080');
INSERT INTO colors (name, hex_code) VALUES ('Purple', '#800080');
INSERT INTO colors (name, hex_code) VALUES ('Orange', '#FFA500');
INSERT INTO colors (name, hex_code) VALUES ('Pink', '#FFC0CB');
-- Additional colors
INSERT INTO colors (name, hex_code) VALUES ('Brown', '#A52A2A');
INSERT INTO colors (name, hex_code) VALUES ('Cyan', '#00FFFF');
INSERT INTO colors (name, hex_code) VALUES ('Magenta', '#FF00FF');
INSERT INTO colors (name, hex_code) VALUES ('Lime', '#00FF00');
INSERT INTO colors (name, hex_code) VALUES ('Silver', '#C0C0C0');
INSERT INTO colors (name, hex_code) VALUES ('Teal', '#008080');
INSERT INTO colors (name, hex_code) VALUES ('Maroon', '#800000');
INSERT INTO colors (name, hex_code) VALUES ('Olive', '#808000');
INSERT INTO colors (name, hex_code) VALUES ('Navy', '#000080');
INSERT INTO colors (name, hex_code) VALUES ('Fuchsia', '#FF00FF');


select * from colors;
-- ----------------------------------------------------------------------------------------------------------------

-- Insert data into Sizes (with initials only)
INSERT INTO sizes (name) VALUES ('S');
INSERT INTO sizes (name) VALUES ('M');
INSERT INTO sizes (name) VALUES ('L');
INSERT INTO sizes (name) VALUES ('XL');

-- Insert data into Genders
INSERT INTO genders (name) VALUES ('Male');
INSERT INTO genders (name) VALUES ('Female');
INSERT INTO genders (name) VALUES ('Unisex');

-- Insert data into Products
INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P001', 'Basic Red T-Shirt', 'A basic red T-shirt made from soft cotton.', 19.99, 50, '2024-07-22 10:00:00', 1, 1, 2, 3);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P002', 'Blue Denim Jeans', 'Classic blue denim jeans with a comfortable fit.', 49.99, 30, '2024-07-22 11:00:00', 2, 2, 3, 2);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P003', 'Green Winter Jacket', 'A warm green jacket perfect for winter.', 89.99, 20, '2024-07-22 12:00:00', 3, 3, 4, 1);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P004', 'Black Leather Jacket', 'Stylish black leather jacket for a modern look.', 129.99, 15, '2024-07-22 13:00:00', 3, 4, 1, 1);

-- Additional sample products
INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P005', 'Cozy Blue Sweater', 'A cozy blue sweater perfect for winter.', 39.99, 40, '2024-07-22 14:00:00', 4, 2, 3, 2);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P006', 'Summer Shorts', 'Lightweight shorts ideal for hot weather.', 24.99, 60, '2024-07-22 15:00:00', 5, 1, 2, 3);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P007', 'Stylish Hat', 'A fashionable hat suitable for all seasons.', 15.99, 70, '2024-07-22 16:00:00', 6, 5, 1, 3);

INSERT INTO products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id) 
VALUES ('P008', 'Comfortable Running Shoes', 'Shoes designed for comfort and style.', 59.99, 25, '2024-07-22 17:00:00', 7, 6, 4, 1);

select * from products;
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
    genders.name AS gender,
    active as active
FROM products
LEFT JOIN categories ON products.category_id = categories.category_id
LEFT JOIN colors ON products.color_id = colors.color_id
LEFT JOIN sizes ON products.size_id = sizes.size_id
LEFT JOIN genders ON products.gender_id = genders.gender_id;
-- WHERE products.id = 'P001';

select * from products;
select * from categories;

select * from colors;

select * from sizes;

select * from genders;

VACUUM;
