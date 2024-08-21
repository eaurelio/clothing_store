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
    tracking_code TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES order_status(status_id)
);

select * from orders;


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
INSERT INTO order_status (status_name) VALUES ('Canceled');


select * from order_status;

select * from orders;
select * from order_items;

SELECT 
  orders.order_id, 
  orders.user_id, 
  orders.order_date, 
  order_status.status_name AS status_name, 
  orders.total
FROM orders
INNER JOIN order_status 
  ON orders.status_id = order_status.status_id;


select * from orders
where user_id = '270bfc10-1dd8-43f3-aef9-678cc5ab8084'

select * from order_items
where order_id = 'd202bf34-f7c4-4271-a09d-e21ff28a9b1a'