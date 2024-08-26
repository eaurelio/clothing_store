-- Active: 1724265540917@@127.0.0.1@5432@clothing_db
CREATE DATABASE CLOTHING_DB;

-------------------------------------------------------------------------------

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    personal_id TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    birthdate DATE NOT NULL,
    address TEXT NOT NULL,
    number TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP
);

ALTER TABLE users
ALTER COLUMN gender TYPE INTEGER USING gender::INTEGER;


ALTER TABLE users
ADD CONSTRAINT fk_gender
FOREIGN KEY (gender) REFERENCES genders(gender_id);

SELECT * FROM users;


CREATE TABLE phones (
    phone_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    number TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-------------------------------------------------------------------------------
CREATE TABLE order_status (
    status_id SERIAL PRIMARY KEY,
    status_name TEXT NOT NULL
);

INSERT INTO order_status (status_name) VALUES ('Pending');
INSERT INTO order_status (status_name) VALUES ('Processing');
INSERT INTO order_status (status_name) VALUES ('Shipped');
INSERT INTO order_status (status_name) VALUES ('Completed');
INSERT INTO order_status (status_name) VALUES ('Canceled');

CREATE TABLE orders (
    order_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_id INTEGER NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    tracking_code TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES order_status(status_id)
);

CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


select * from orders;
select * from order_items;

-------------------------------------------------------------------------------
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

INSERT INTO categories (name, description) VALUES 
('T-Shirts', 'Casual shirts typically made from cotton or synthetic materials.'),
('Jeans', 'Denim pants available in various cuts and styles.'),
('Jackets', 'Outerwear for protection against cold and rain.'),
('Dresses', 'One-piece garments for women and girls.'),
('Sweaters', 'Knit garments for warmth.'),
('Shorts', 'Casual wear for warm weather.'),
('Hoodies', 'Sweatshirts with hoods for casual wear.'),
('Skirts', 'Garments that hang from the waist and come in various lengths.'),
('Suits', 'Formal attire including jackets and trousers or skirts.'),
('Activewear', 'Clothing designed for exercise and sports.'),
('Blazers', 'Formal jackets often worn with suits or dress pants.'),
('Coats', 'Heavy outerwear for cold weather.'),
('Cardigans', 'Open-front sweaters that can be buttoned up.'),
('Vests', 'Sleeveless garments worn over shirts or blouses.'),
('Leggings', 'Tight-fitting pants made from stretchy fabric.'),
('Overalls', 'Garments with a bib and shoulder straps, often worn over other clothes.'),
('Bathrobes', 'Robes worn after bathing or lounging.'),
('Tunics', 'Loose-fitting tops that often cover the hips and thighs.'),
('Pajamas', 'Comfortable clothing worn for sleeping.'),
('Shirts', 'Button-down shirts that can be dressed up or down.');



CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    hex_code TEXT
);

INSERT INTO colors (name, hex_code) VALUES 
('Red', '#FF0000'),
('Blue', '#0000FF'),
('Green', '#008000'),
('Black', '#000000'),
('White', '#FFFFFF'),
('Gray', '#808080'),
('Yellow', '#FFFF00'),
('Pink', '#FFC0CB'),
('Purple', '#800080'),
('Orange', '#FFA500'),
('Gray', '#808080'),
('Yellow', '#FFFF00'),
('Pink', '#FFC0CB'),
('Purple', '#800080'),
('Orange', '#FFA500'),
('Brown', '#A52A2A'),
('Beige', '#F5F5DC'),
('Teal', '#008080'),
('Cyan', '#00FFFF'),
('Magenta', '#FF00FF');

CREATE TABLE sizes (
    size_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO sizes (name) VALUES 
('S'),       -- Small
('M'),       -- Medium
('L'),       -- Large
('XL'),      -- Extra Large
('XXL');     -- Double Extra Large


CREATE TABLE genders (
    gender_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO genders (name) VALUES 
('Male'),
('Female'),
('Unisex');


CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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

SELECT id, price
FROM products;

CREATE TABLE product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt TEXT
);

drop table product_images;

-------------------------------------------------------------------------------
-- Excluir tabelas se existirem
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlists;

CREATE TABLE wishlists (
    wishlist_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wishlist_items (
    wishlist_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY (wishlist_id, product_id)
);

select * from wishlist_items;

----------------------------------------------------------------

DROP TABLE TICKETS;

CREATE TABLE tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type_id INT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone_number TEXT NOT NULL,
    description TEXT NOT NULL,
    solution TEXT,
    analist_name TEXT,
    analist_email TEXT,
    status_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_type
        FOREIGN KEY (type_id)
        REFERENCES ticket_types(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_status
        FOREIGN KEY (status_id)
        REFERENCES ticket_status(id)
        ON DELETE SET NULL
);

----------------------------------------------------------------

CREATE TABLE ticket_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE ticket_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO ticket_types (type_name) VALUES ('reset_password');
INSERT INTO ticket_types (type_name) VALUES ('order_issue');
INSERT INTO ticket_types (type_name) VALUES ('product_problem');
INSERT INTO ticket_types (type_name) VALUES ('account_issue');
INSERT INTO ticket_types (type_name) VALUES ('refund_request');
INSERT INTO ticket_types (type_name) VALUES ('general_inquiry');


INSERT INTO ticket_status (status) VALUES ('Pending');
INSERT INTO ticket_status (status) VALUES ('In Progress');
INSERT INTO ticket_status (status) VALUES ('Resolved');
INSERT INTO ticket_status (status) VALUES ('Cancelled');