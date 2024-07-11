-- Active: 1720203816356@@127.0.0.1@3306
DROP TABLE users;
-- CREATE TABLE users (
--     id TEXT PRIMARY KEY UNIQUE NOT NULL,
--     name TEXT NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     password TEXT NOT NULL,
--     created_at TEXT DEFAULT (DATETIME()) NOT NULL,
--     role TEXT
-- );

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    role TEXT NOT NULL DEFAULT 'NORMAL',
    birthdate TEXT NOT NULL,
    address TEXT NOT NULL,
    number TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    gender TEXT NOT NULL
);

CREATE TABLE phones (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



INSERT INTO users (id, name, email, password, role)
VALUES
	('u001', 'Fulano', 'fulano@email.com', 'fulano123', 'NORMAL'),
	('u002', 'Beltrana', 'beltrana@email.com', 'beltrana00', 'NORMAL');


select * from users;


eyJ1c2VySWQiOiI0YTgyNTdiMS0yOTgwLTQ1NWQtYmJlMS00OGQ3YjBlNzJkNzgiLCJjcmVhdGVkQXQiOjE3MjA1ODA4MDYzNTgsImV4cGlyZXNBdCI6MTcyMDY2NzIwNjM1OH0=.mszXPcAKtOzIzXAGdSVUx13ZqjIK0PQB+hq/l243soM=