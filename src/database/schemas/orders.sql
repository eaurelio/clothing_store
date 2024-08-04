drop table orders;

-- Criar a tabela order_status com status_id autoincremental
CREATE TABLE order_status (
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    status_name TEXT NOT NULL
);

-- Criar a tabela orders com referência a order_status
CREATE TABLE orders (
    order_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES order_status(status_id)
);

-- Criar a tabela order_items
CREATE TABLE order_items (
    item_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_status (status_name) VALUES ('Pending');
INSERT INTO order_status (status_name) VALUES ('Processing');
INSERT INTO order_status (status_name) VALUES ('Shipped');
INSERT INTO order_status (status_name) VALUES ('Completed');
