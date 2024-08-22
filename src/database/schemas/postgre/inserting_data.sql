-- Inserir pedidos e itens para o usuário 8603cc1b-d667-4f4f-a5ec-989c403e560f
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8603cc1b-d667-4f4f-a5ec-989c403e560f', '2024-08-20', 1, 219.97);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'e7f9cab3-a7a0-400b-adcc-489f6e1faa6c', 2, 49.99),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '870d3b1b-a6d3-4255-893c-af31839c0ca7', 1, 119.99);

-- Inserir pedidos e itens para o usuário 26315a23-2db7-4969-8f76-b975a5bcc5b6
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '26315a23-2db7-4969-8f76-b975a5bcc5b6', '2024-08-19', 1, 89.99);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '9d841805-f14d-4b98-a58c-b07cc0823240', 1, 89.99);

-- Inserir pedidos e itens para o usuário e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('c3d4e5f6-g7h8-9012-cdef-34567890123', 'e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04', '2024-08-18', 1, 129.99);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('c3d4e5f6-g7h8-9012-cdef-34567890123', '63e10790-91aa-4189-9162-bd63682b560f', 1, 129.99);

-- Inserir pedidos e itens para o usuário 64cdd6b7-13b5-423c-8aa4-c435853cfe86
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('d4e5f6g7-h8i9-0123-def4-56789012345', '64cdd6b7-13b5-423c-8aa4-c435853cfe86', '2024-08-17', 1, 119.98);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('d4e5f6g7-h8i9-0123-def4-56789012345', 'c368d633-7374-4e7d-bdae-9c88ef2044da', 2, 59.99);

-- Inserir pedidos e itens para o usuário 8361d8ed-c05e-4158-ac72-d49b79f452bd
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('e5f6g7h8-i9j0-1234-ef56-78901234567', '8361d8ed-c05e-4158-ac72-d49b79f452bd', '2024-08-16', 1, 99.98);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('e5f6g7h8-i9j0-1234-ef56-78901234567', 'c75abcf0-e8a7-4904-9c1f-a70eb5831742', 1, 74.99),
('e5f6g7h8-i9j0-1234-ef56-78901234567', '9ba0f618-754c-48aa-8609-60458a8842b4', 1, 89.99);

-- Inserir pedidos e itens para o usuário f0ce9152-0166-467d-9f79-8aee7a6e770f
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('f6g7h8i9-j0k1-2345-f678-90123456789', 'f0ce9152-0166-467d-9f79-8aee7a6e770f', '2024-08-15', 1, 74.98);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('f6g7h8i9-j0k1-2345-f678-90123456789', 'df717f7c-251a-4bd6-ab16-ebf00cfb3c23', 1, 89.99),
('f6g7h8i9-j0k1-2345-f678-90123456789', 'c368d633-7374-4e7d-bdae-9c88ef2044da', 1, 29.99);

-- Inserir pedidos e itens para o usuário 1aa7b223-8843-4efc-9007-c0eb5763f7ff
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('g7h8i9j0-k1l2-3456-ghi7-89012345678', '1aa7b223-8843-4efc-9007-c0eb5763f7ff', '2024-08-14', 1, 39.99);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('g7h8i9j0-k1l2-3456-ghi7-89012345678', '1154a121-b49e-43d5-8496-5241fc8a3c3b', 1, 39.99);

-- Inserir pedidos e itens para o usuário c3d4dea2-6d46-45e4-9a1a-db2d1e8981fc
INSERT INTO orders (order_id, user_id, order_date, status_id, total) VALUES
('h8i9j0k1-l2m3-4567-ijk8-90123456789', 'c3d4dea2-6d46-45e4-9a1a-db2d1e8981fc', '2024-08-13', 1, 169.98);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('h8i9j0k1-l2m3-4567-ijk8-90123456789', 'fbfec9c6-0c52-4a74-ae8e-477b226ba967', 1, 89.99),
('h8i9j0k1-l2m3-4567-ijk8-90123456789', '63e10790-91aa-4189-9162-bd63682b560f', 1, 129.99);


------------------------------------------------------------------------------------------------------------------

-- Inserir wishlists para cada usuário
INSERT INTO wishlists (user_id, created_at) VALUES
('8361d8ed-c05e-4158-ac72-d49b79f452bd', '2024-08-20'),
('f0ce9152-0166-467d-9f79-8aee7a6e770f', '2024-08-20'),
('1aa7b223-8843-4efc-9007-c0eb5763f7ff', '2024-08-20'),
('c3d4dea2-6d46-45e4-9a1a-db2d1e8981fc', '2024-08-20'),
('cdc56bc7-7e4d-42cf-82ec-e2b936e3ef7b', '2024-08-20');

-- Inserir wishlist_items (distribuir produtos de forma randômica entre as wishlists)
INSERT INTO wishlist_items (wishlist_id, product_id) VALUES
(1, '63e10790-91aa-4189-9162-bd63682b560f'),
(1, 'fbfec9c6-0c52-4a74-ae8e-477b226ba967'),
(1, '991c6201-f0bf-4a22-afd1-a536e2171b75'),
(2, '02e6094d-4fee-4466-b62d-8acc47a548ba'),
(2, 'c90e936d-3c8f-4bdb-a1b3-143b0cc6630e'),
(3, '15d596af-2f59-49ac-b31b-cbefe121ebc0'),
(3, 'df717f7c-251a-4bd6-ab16-ebf00cfb3c23'),
(3, 'd4dcd5f2-9e4c-496c-8bb4-50592dced40d'),
(4, '87c10056-0a9b-4bc0-83e7-89366829557d'),
(4, '96e60405-fd9e-479a-a0bb-09295a6b449c'),
(4, '54da52ee-8903-4c14-8a6d-86a000ae9520'),
(5, 'a4aca9cb-185a-40f0-90dc-b7a61b29a411'),
(5, 'b17634c4-f17a-4f78-a0b2-461bd8456116'),
(5, '2837ce10-fbd5-4261-9025-7af9d6142a2a');
