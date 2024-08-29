CREATE TABLE users_audit (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    personal_id TEXT,
    entity_type TEXT,
    name TEXT,
    gender TEXT,
    email TEXT,
    password TEXT,
    role TEXT,
    created_at TIMESTAMP,
    birthdate DATE,
    address TEXT,
    number TEXT,
    neighborhood TEXT,
    city TEXT,
    country TEXT,
    active BOOLEAN,
    last_login TIMESTAMP,
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT -- Optional, if you want to track who made the change
);

----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_user_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type
    ) VALUES (
        NEW.id, NEW.personal_id, NEW.entity_type, NEW.name, NEW.gender, 
        NEW.email, NEW.password, NEW.role, NEW.created_at, NEW.birthdate, 
        NEW.address, NEW.number, NEW.neighborhood, NEW.city, NEW.country, 
        NEW.active, NEW.last_login, 'INSERT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_insert_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION audit_user_insert();

----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_user_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type, changed_at
    ) VALUES (
        OLD.id, OLD.personal_id, OLD.entity_type, OLD.name, OLD.gender, OLD.email, 
        OLD.password, OLD.role, OLD.created_at, OLD.birthdate, OLD.address, 
        OLD.number, OLD.neighborhood, OLD.city, OLD.country, OLD.active, 
        OLD.last_login, 'UPDATE', CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER user_update_trigger
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_user_update();

----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_user_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type
    ) VALUES (
        OLD.id, OLD.personal_id, OLD.entity_type, OLD.name, OLD.gender, 
        OLD.email, OLD.password, OLD.role, OLD.created_at, OLD.birthdate, 
        OLD.address, OLD.number, OLD.neighborhood, OLD.city, OLD.country, 
        OLD.active, OLD.last_login, 'DELETE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_delete_trigger
AFTER DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_user_delete();

----------------------------------------------------------------------------

CREATE TABLE phones_audit (
    id SERIAL PRIMARY KEY,
    phone_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    number TEXT,
    type TEXT,
    operation_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by TEXT, -- Optional, if you want to track who made the change
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE OR REPLACE FUNCTION audit_phone_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        NEW.phone_id, NEW.user_id, NEW.number, NEW.type, 'INSERT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phone_insert_trigger
AFTER INSERT ON phones
FOR EACH ROW
EXECUTE FUNCTION audit_phone_insert();


CREATE OR REPLACE FUNCTION audit_phone_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        OLD.phone_id, OLD.user_id, OLD.number, OLD.type, 'UPDATE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phone_update_trigger
AFTER UPDATE ON phones
FOR EACH ROW
EXECUTE FUNCTION audit_phone_update();


CREATE OR REPLACE FUNCTION audit_phone_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        OLD.phone_id, OLD.user_id, OLD.number, OLD.type, 'DELETE'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phone_delete_trigger
AFTER DELETE ON phones
FOR EACH ROW
EXECUTE FUNCTION audit_phone_delete();

