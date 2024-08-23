CREATE TABLE orders_audit (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    order_date TIMESTAMP,
    status_id INTEGER,
    total NUMERIC(10, 2),
    tracking_code TEXT,
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT, -- Optional, if you want to track who made the change
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES order_status(status_id)
);

CREATE OR REPLACE FUNCTION audit_order_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO orders_audit (
        order_id, user_id, order_date, status_id, total, tracking_code, operation_type
    ) VALUES (
        NEW.order_id, NEW.user_id, NEW.order_date, NEW.status_id, NEW.total, NEW.tracking_code, 'INSERT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_insert_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION audit_order_insert();


CREATE OR REPLACE FUNCTION audit_order_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO orders_audit (
        order_id, user_id, order_date, status_id, total, tracking_code, operation_type
    ) VALUES (
        OLD.order_id, OLD.user_id, OLD.order_date, OLD.status_id, OLD.total, OLD.tracking_code, 'UPDATE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_update_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION audit_order_update();


CREATE OR REPLACE FUNCTION audit_order_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO orders_audit (
        order_id, user_id, order_date, status_id, total, tracking_code, operation_type
    ) VALUES (
        OLD.order_id, OLD.user_id, OLD.order_date, OLD.status_id, OLD.total, OLD.tracking_code, 'DELETE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_delete_trigger
AFTER DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION audit_order_delete();

----------------------------------------------------

CREATE TABLE order_items_audit (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER,
    price NUMERIC(10, 2),
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT, -- Optional, if you want to track who made the change
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE OR REPLACE FUNCTION audit_order_item_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_items_audit (
        item_id, order_id, product_id, quantity, price, operation_type
    ) VALUES (
        NEW.item_id, NEW.order_id, NEW.product_id, NEW.quantity, NEW.price, 'INSERT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_item_insert_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION audit_order_item_insert();


CREATE OR REPLACE FUNCTION audit_order_item_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_items_audit (
        item_id, order_id, product_id, quantity, price, operation_type
    ) VALUES (
        OLD.item_id, OLD.order_id, OLD.product_id, OLD.quantity, OLD.price, 'UPDATE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_item_update_trigger
AFTER UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION audit_order_item_update();


CREATE OR REPLACE FUNCTION audit_order_item_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_items_audit (
        item_id, order_id, product_id, quantity, price, operation_type
    ) VALUES (
        OLD.item_id, OLD.order_id, OLD.product_id, OLD.quantity, OLD.price, 'DELETE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_item_delete_trigger
AFTER DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION audit_order_item_delete();

