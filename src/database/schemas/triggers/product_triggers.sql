CREATE TABLE products_audit (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT,
    description TEXT,
    price NUMERIC(10, 2),
    stock INTEGER,
    created_at TIMESTAMP,
    category_id INTEGER,
    color_id INTEGER,
    size_id INTEGER,
    gender_id INTEGER,
    active BOOLEAN,
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT, -- Optional, if you want to track who made the change
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (color_id) REFERENCES colors(color_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id),
    FOREIGN KEY (gender_id) REFERENCES genders(gender_id)
);

CREATE OR REPLACE FUNCTION audit_product_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        NEW.id, NEW.name, NEW.description, NEW.price, NEW.stock, NEW.created_at,
        NEW.category_id, NEW.color_id, NEW.size_id, NEW.gender_id, NEW.active, 'INSERT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_insert_trigger
AFTER INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION audit_product_insert();


CREATE OR REPLACE FUNCTION audit_product_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        OLD.id, OLD.name, OLD.description, OLD.price, OLD.stock, OLD.created_at,
        OLD.category_id, OLD.color_id, OLD.size_id, OLD.gender_id, OLD.active, 'UPDATE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_update_trigger
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION audit_product_update();

CREATE OR REPLACE FUNCTION audit_product_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        OLD.id, OLD.name, OLD.description, OLD.price, OLD.stock, OLD.created_at,
        OLD.category_id, OLD.color_id, OLD.size_id, OLD.gender_id, OLD.active, 'DELETE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_delete_trigger
AFTER DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION audit_product_delete();
