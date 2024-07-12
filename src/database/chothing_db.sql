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
    role TEXT NOT NULL DEFAULT 'NORMAL',
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    birthdate TEXT NOT NULL,
    address TEXT NOT NULL,
    number TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    gender TEXT NOT NULL
);


select * from users;
PRAGMA table_info(users);

drop table phones;
CREATE TABLE phones (
    phone_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    number TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


select * from phones;

