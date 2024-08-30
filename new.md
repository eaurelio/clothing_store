{
    "personalId": "25414789896",
    "entityType": "PERSONAL",
    "name": "Solvd Client",
    "email": "client@solvd.com",
    "password": "SolvdPass#2024",
    "birthdate": "1990-07-22",
    "role": "CLIENT",
    "address": "1646 N. California Blvd., Suite 515",
    "number": "10",
    "neighborhood": "Walnut Creek",
    "city": "Walnut Creek",
    "state": "CA",
    "country": "USA",
    "zip": "94596",
    "gender": "1",
     "phones": [
        {
            "number": "+1-408-555-1234",
            "type": "Mobile"
        }
    ]
}

{
    "personalId": "25414789897",
    "entityType": "PERSONAL",
    "name": "Solvd Admin",
    "email": "admin@solvd.com",
    "password": "SolvdPass#2024",
    "birthdate": "1990-07-22",
    "role": "ADMIN",
    "address": "1646 N. California Blvd., Suite 515",
    "number": "10",
    "neighborhood": "Walnut Creek",
    "city": "Walnut Creek",
    "state": "CA",
    "country": "USA",
    "zip": "94596",
    "gender": "1",
     "phones": [
        {
            "number": "+1-408-555-1234",
            "type": "Mobile"
        }
    ]
}



Claro, aqui está um trecho para incluir na documentação:

---

## Database Setup and Testing

### Database Setup

1. **Backup the Existing Database**

   ```bash
   docker exec -t clothing_store_db pg_dumpall -c -U ${DB_USER} > backup.sql
   ```

2. **Create and Start a New PostgreSQL Container**

   Update the `docker-compose.yml` file to use a different port for the new PostgreSQL container:

   ```yaml
   services:
     postgres:
       image: postgres:latest
       container_name: clothing_store_db
       environment:
         POSTGRES_USER: ${DB_USER}
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: ${DB_NAME}
       ports:
         - "5433:5432"
       networks:
         - mynetwork
   ```

   Run:

   ```bash
   docker-compose up -d
   ```

3. **Restore the Backup to the New Database**

   ```bash
   docker cp backup.sql clothing_store_db:/backup.sql
   docker exec -it clothing_store_db sh -c 'psql -U ${DB_USER} -d ${DB_NAME} -f /backup.sql'
   ```

### Testing with User Accounts

To test the API, you can log in with one of the following pre-created accounts to receive a token:

1. **Client Account**

   - **Email:** jakub.kowalski@example.pl
   - **Password:** PolandPass#2024

   **Login Request:**

   ```http
   POST /login
   Content-Type: application/json

   {
     "email": "jakub.kowalski@example.pl",
     "password": "PolandPass#2024"
   }
   ```

2. **Admin Account**

   - **Email:** admin@solvd.com
   - **Password:** AdminPass#2024

   **Login Request:**

   ```http
   POST /login
   Content-Type: application/json

   {
     "email": "admin@solvd.com",
     "password": "AdminPass#2024"
   }
   ```

**Note:** Replace the example email and password with the ones you used during account creation.

---



{
    "products": [
        {
            "id": "e85745de-032c-43e8-90dd-79c9d6489fb1",
            "name": "Elegant Wrap Dress",
            "description": "A stylish wrap dress that enhances any silhouette.",
            "active": true,
            "price": "99.99",
            "stock": 20,
            "created_at": "2024-08-21T23:22:27.898Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 5,
            "color": "White",
            "size_id": 3,
            "size": "L",
            "gender_id": 1,
            "gender": "Male",
            "images": [
                {
                    "id": "e2314630-613f-48db-bdb8-fad20ac215de",
                    "product_id": "e85745de-032c-43e8-90dd-79c9d6489fb1",
                    "url": "https://example.com/images/dress_front.jpg",
                    "alt": "Back view of the elegant Winter dress"
                },
                {
                    "id": "6932e494-e895-4617-93e6-9a14c90104ac",
                    "product_id": "e85745de-032c-43e8-90dd-79c9d6489fb1",
                    "url": "https://example.com/images/dress_backs12.jpg",
                    "alt": "Back view of the elegant Winter dress"
                }
            ]
        },
        {
            "id": "e7f9cab3-a7a0-400b-adcc-489f6e1faa6c",
            "name": "Casual Plaid Shirt",
            "description": "A relaxed plaid shirt perfect for casual outings.",
            "active": true,
            "price": "49.99",
            "stock": 40,
            "created_at": "2024-08-21T23:22:39.877Z",
            "category_id": 1,
            "category": "T-Shirts",
            "color_id": 4,
            "color": "Black",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "870d3b1b-a6d3-4255-893c-af31839c0ca7",
            "name": "Stylish Suede Boots",
            "description": "Fashionable suede boots for a trendy look.",
            "active": true,
            "price": "119.99",
            "stock": 25,
            "created_at": "2024-08-21T23:22:48.667Z",
            "category_id": 4,
            "category": "Dresses",
            "color_id": 3,
            "color": "Green",
            "size_id": 4,
            "size": "XL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "9d841805-f14d-4b98-a58c-b07cc0823240",
            "name": "Modern Cargo Pants",
            "description": "Functional cargo pants with a modern design.",
            "active": true,
            "price": "59.99",
            "stock": 30,
            "created_at": "2024-08-21T23:22:58.395Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 2,
            "color": "Blue",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "c368d633-7374-4e7d-bdae-9c88ef2044da",
            "name": "Chic Printed Scarf",
            "description": "A stylish scarf with a chic print to complete any outfit.",
            "active": true,
            "price": "29.99",
            "stock": 45,
            "created_at": "2024-08-21T23:23:07.115Z",
            "category_id": 6,
            "category": "Shorts",
            "color_id": 1,
            "color": "Red",
            "size_id": 1,
            "size": "S",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "c75abcf0-e8a7-4904-9c1f-a70eb5831742",
            "name": "Comfortable Knit Dress",
            "description": "A cozy knit dress suitable for both casual and dressy occasions.",
            "active": true,
            "price": "74.99",
            "stock": 25,
            "created_at": "2024-08-21T23:23:17.085Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 15,
            "color": "Orange",
            "size_id": 4,
            "size": "XL",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "9ba0f618-754c-48aa-8609-60458a8842b4",
            "name": "Elegant Silk Blouse",
            "description": "A luxurious silk blouse for sophisticated outfits.",
            "active": true,
            "price": "89.99",
            "stock": 20,
            "created_at": "2024-08-21T23:23:25.934Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 14,
            "color": "Purple",
            "size_id": 3,
            "size": "L",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "1154a121-b49e-43d5-8496-5241fc8a3c3b",
            "name": "Casual Polo Shirt",
            "description": "A comfortable polo shirt for casual wear.",
            "active": true,
            "price": "39.99",
            "stock": 50,
            "created_at": "2024-08-21T23:23:36.933Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 13,
            "color": "Pink",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "2e763e3e-0024-4def-883c-407f6c7ab362",
            "name": "Trendy Denim Jacket",
            "description": "A classic denim jacket with a modern twist.",
            "active": true,
            "price": "89.99",
            "stock": 30,
            "created_at": "2024-08-21T23:23:46.722Z",
            "category_id": 2,
            "category": "Jeans",
            "color_id": 12,
            "color": "Yellow",
            "size_id": 4,
            "size": "XL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "63e10790-91aa-4189-9162-bd63682b560f",
            "name": "Sleek Black Dress Shoes",
            "description": "Stylish black dress shoes for formal occasions.",
            "active": true,
            "price": "129.99",
            "stock": 30,
            "created_at": "2024-08-21T23:23:56.512Z",
            "category_id": 4,
            "category": "Dresses",
            "color_id": 11,
            "color": "Gray",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "fbfec9c6-0c52-4a74-ae8e-477b226ba967",
            "name": "Soft Wool Sweater",
            "description": "A cozy wool sweater for cold winter days.",
            "active": true,
            "price": "89.99",
            "stock": 25,
            "created_at": "2024-08-21T23:24:06.645Z",
            "category_id": 6,
            "category": "Shorts",
            "color_id": 10,
            "color": "Orange",
            "size_id": 4,
            "size": "XL",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "991c6201-f0bf-4a22-afd1-a536e2171b75",
            "name": "Comfortable Jogger Pants",
            "description": "Comfortable joggers for relaxing or casual outings.",
            "active": true,
            "price": "49.99",
            "stock": 40,
            "created_at": "2024-08-21T23:24:15.340Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 9,
            "color": "Purple",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "02e6094d-4fee-4466-b62d-8acc47a548ba",
            "name": "Vintage Bomber Jacket",
            "description": "A stylish bomber jacket with a vintage flair.",
            "active": true,
            "price": "99.99",
            "stock": 20,
            "created_at": "2024-08-21T23:24:24.090Z",
            "category_id": 2,
            "category": "Jeans",
            "color_id": 8,
            "color": "Pink",
            "size_id": 4,
            "size": "XL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "c90e936d-3c8f-4bdb-a1b3-143b0cc6630e",
            "name": "Lightweight Travel Jacket",
            "description": "A lightweight jacket ideal for travel and outdoor activities.",
            "active": true,
            "price": "79.99",
            "stock": 35,
            "created_at": "2024-08-21T23:24:35.038Z",
            "category_id": 2,
            "category": "Jeans",
            "color_id": 7,
            "color": "Yellow",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "15d596af-2f59-49ac-b31b-cbefe121ebc0",
            "name": "Elegant Cocktail Dress",
            "description": "An elegant cocktail dress perfect for evening events.",
            "active": true,
            "price": "139.99",
            "stock": 15,
            "created_at": "2024-08-21T23:24:43.246Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 6,
            "color": "Gray",
            "size_id": 3,
            "size": "L",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "df717f7c-251a-4bd6-ab16-ebf00cfb3c23",
            "name": "Cozy Fleece Jacket",
            "description": "A soft fleece jacket ideal for keeping warm during chilly days.",
            "active": true,
            "price": "89.99",
            "stock": 30,
            "created_at": "2024-08-21T23:24:51.760Z",
            "category_id": 2,
            "category": "Jeans",
            "color_id": 15,
            "color": "Orange",
            "size_id": 4,
            "size": "XL",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "dcc69f2e-8107-48c8-9e51-e17c8a351719",
            "name": "Sleek Leather Wallet",
            "description": "A sleek and stylish wallet made from premium leather.",
            "active": true,
            "price": "39.99",
            "stock": 40,
            "created_at": "2024-08-21T23:25:00.256Z",
            "category_id": 6,
            "category": "Shorts",
            "color_id": 14,
            "color": "Purple",
            "size_id": 1,
            "size": "S",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "ed71257a-972d-4445-a2da-bc49783a1c50",
            "name": "Summer Floral Dress",
            "description": "A breezy floral dress perfect for sunny days.",
            "active": true,
            "price": "74.99",
            "stock": 20,
            "created_at": "2024-08-21T23:25:09.124Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 13,
            "color": "Pink",
            "size_id": 2,
            "size": "M",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "910065e3-91b1-4d02-a9d4-d65528ffabbe",
            "name": "Casual Graphic Tee",
            "description": "A fun graphic tee for relaxed, everyday wear.",
            "active": true,
            "price": "29.99",
            "stock": 45,
            "created_at": "2024-08-21T23:25:50.940Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 12,
            "color": "Yellow",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "d4dcd5f2-9e4c-496c-8bb4-50592dced40d",
            "name": "Trendy High-Waisted Skirt",
            "description": "A fashionable high-waisted skirt perfect for stylish ensembles.",
            "active": true,
            "price": "54.99",
            "stock": 30,
            "created_at": "2024-08-21T23:26:00.359Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 11,
            "color": "Gray",
            "size_id": 3,
            "size": "L",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "dadfd34b-7761-42ff-b407-cd49b2f3f78f",
            "name": "Chic Leather Boots",
            "description": "Elegant leather boots that complement both casual and formal outfits.",
            "active": true,
            "price": "119.99",
            "stock": 25,
            "created_at": "2024-08-21T23:26:09.528Z",
            "category_id": 4,
            "category": "Dresses",
            "color_id": 10,
            "color": "Orange",
            "size_id": 4,
            "size": "XL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "87c10056-0a9b-4bc0-83e7-89366829557d",
            "name": "Luxurious Silk Scarf",
            "description": "A silky scarf to add a touch of luxury to any outfit.",
            "active": true,
            "price": "34.99",
            "stock": 60,
            "created_at": "2024-08-21T23:26:19.097Z",
            "category_id": 6,
            "category": "Shorts",
            "color_id": 9,
            "color": "Purple",
            "size_id": 1,
            "size": "S",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "96e60405-fd9e-479a-a0bb-09295a6b449c",
            "name": "Classic White Button-Down",
            "description": "A timeless button-down shirt for a polished look.",
            "active": true,
            "price": "49.99",
            "stock": 40,
            "created_at": "2024-08-21T23:26:28.646Z",
            "category_id": 1,
            "category": "T-Shirts",
            "color_id": 8,
            "color": "Pink",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "54da52ee-8903-4c14-8a6d-86a000ae9520",
            "name": "Urban Denim Jeans",
            "description": "Stylish jeans with a modern fit and durable fabric.",
            "active": true,
            "price": "69.99",
            "stock": 35,
            "created_at": "2024-08-21T23:26:40.086Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 7,
            "color": "Yellow",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "a4aca9cb-185a-40f0-90dc-b7a61b29a411",
            "name": "Cozy Knit Sweater",
            "description": "A warm sweater for chilly weather and cozy evenings.",
            "active": true,
            "price": "59.99",
            "stock": 25,
            "created_at": "2024-08-21T23:26:47.325Z",
            "category_id": 6,
            "category": "Shorts",
            "color_id": 2,
            "color": "Blue",
            "size_id": 4,
            "size": "XL",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "b17634c4-f17a-4f78-a0b2-461bd8456116",
            "name": "Performance Running Shoes",
            "description": "High-performance shoes for running and athletic activities.",
            "active": true,
            "price": "89.99",
            "stock": 40,
            "created_at": "2024-08-21T23:26:57.414Z",
            "category_id": 4,
            "category": "Dresses",
            "color_id": 5,
            "color": "White",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "2837ce10-fbd5-4261-9025-7af9d6142a2a",
            "name": "Professional Business Suit",
            "description": "A sophisticated suit for business meetings and professional settings.",
            "active": true,
            "price": "199.99",
            "stock": 15,
            "created_at": "2024-08-21T23:27:07.976Z",
            "category_id": 1,
            "category": "T-Shirts",
            "color_id": 4,
            "color": "Black",
            "size_id": 5,
            "size": "XXL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "d6d6c2bc-b013-4feb-aee2-3b5e11b32b70",
            "name": "Summer Breeze Shorts",
            "description": "Comfortable shorts for hot summer days.",
            "active": true,
            "price": "39.99",
            "stock": 50,
            "created_at": "2024-08-21T23:27:17.713Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 1,
            "color": "Red",
            "size_id": 2,
            "size": "M",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "a6d14c7c-ab07-49a9-925a-961e439db995",
            "name": "Elegant Evening Gown",
            "description": "An elegant dress for formal events and special occasions.",
            "active": true,
            "price": "129.99",
            "stock": 20,
            "created_at": "2024-08-21T23:27:28.002Z",
            "category_id": 5,
            "category": "Sweaters",
            "color_id": 6,
            "color": "Gray",
            "size_id": 3,
            "size": "L",
            "gender_id": 1,
            "gender": "Male",
            "images": []
        },
        {
            "id": "db7b8562-9069-47d3-be8b-9e96d1b700de",
            "name": "Stylish Casual Jacket",
            "description": "A versatile jacket perfect for casual outings and cool weather.",
            "active": true,
            "price": "89.99",
            "stock": 30,
            "created_at": "2024-08-21T23:27:37.021Z",
            "category_id": 2,
            "category": "Jeans",
            "color_id": 3,
            "color": "Green",
            "size_id": 4,
            "size": "XL",
            "gender_id": 2,
            "gender": "Female",
            "images": []
        },
        {
            "id": "fd30b6b9-4531-465a-95b8-cf51a5e90c67",
            "name": "Elegant Winter Dress",
            "description": "A lightweight dress perfect for warm Winter days.",
            "active": true,
            "price": "59.99",
            "stock": 50,
            "created_at": "2024-08-26T20:34:19.377Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 1,
            "color": "Red",
            "size_id": 2,
            "size": "M",
            "gender_id": 1,
            "gender": "Male",
            "images": [
                {
                    "id": "d163c968-07c7-445e-a70d-5bc4cea29937",
                    "product_id": "fd30b6b9-4531-465a-95b8-cf51a5e90c67",
                    "url": "https://example.com/images/dress_front.jpg",
                    "alt": "Front view of the elegant Winter dress"
                },
                {
                    "id": "f3484991-b0cb-468b-9dcf-7ad2b9caba73",
                    "product_id": "fd30b6b9-4531-465a-95b8-cf51a5e90c67",
                    "url": "https://example.com/images/dress_back.jpg",
                    "alt": "Back view of the elegant Winter dress"
                }
            ]
        },
        {
            "id": "9f68db76-e2ea-4fcd-bb0b-514c93d517e3",
            "name": "Elegant Winter Dress2",
            "description": "A lightweight dress perfect for warm Winter days.",
            "active": true,
            "price": "59.99",
            "stock": 50,
            "created_at": "2024-08-28T22:18:34.703Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 1,
            "color": "Red",
            "size_id": 2,
            "size": "M",
            "gender_id": 1,
            "gender": "Male",
            "images": [
                {
                    "id": "cb738840-c031-4e69-9e5a-9a54d8cb28c9",
                    "product_id": "9f68db76-e2ea-4fcd-bb0b-514c93d517e3",
                    "url": "https://example.com/images/dress_front.jpg",
                    "alt": "Front view of the elegant Winter dress"
                },
                {
                    "id": "33d44d91-bbf6-482a-bf2d-30305235bd78",
                    "product_id": "9f68db76-e2ea-4fcd-bb0b-514c93d517e3",
                    "url": "https://example.com/images/dress_back.jpg",
                    "alt": "Back view of the elegant Winter dress"
                }
            ]
        },
        {
            "id": "4eee4b11-a04f-419e-af7e-a3b7478328c0",
            "name": "Elegant Winter Dress3",
            "description": "A lightweight dress perfect for warm Winter days.",
            "active": true,
            "price": "59.99",
            "stock": 50,
            "created_at": "2024-08-29T00:01:46.854Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 1,
            "color": "Red",
            "size_id": 2,
            "size": "M",
            "gender_id": 1,
            "gender": "Male",
            "images": [
                {
                    "id": "261b8200-b868-44db-8757-d9060daf9b28",
                    "product_id": "4eee4b11-a04f-419e-af7e-a3b7478328c0",
                    "url": "https://example.com/images/dress_front.jpg",
                    "alt": "Front view of the elegant Winter dress"
                },
                {
                    "id": "98b2c1b2-23de-4750-b0c9-bdaa306a3c22",
                    "product_id": "4eee4b11-a04f-419e-af7e-a3b7478328c0",
                    "url": "https://example.com/images/dress_back.jpg",
                    "alt": "Back view of the elegant Winter dress"
                }
            ]
        },
        {
            "id": "fa820373-7028-4c31-93e2-40751265ed1d",
            "name": "Elegant Winter Dress4",
            "description": "A lightweight dress perfect for warm Winter days.",
            "active": true,
            "price": "59.99",
            "stock": 50,
            "created_at": "2024-08-29T22:48:03.917Z",
            "category_id": 3,
            "category": "Jackets",
            "color_id": 1,
            "color": "Red",
            "size_id": 2,
            "size": "M",
            "gender_id": 1,
            "gender": "Male",
            "images": [
                {
                    "id": "6a28af97-76be-4283-b834-dc567f5b254c",
                    "product_id": "fa820373-7028-4c31-93e2-40751265ed1d",
                    "url": "https://example.com/images/dress_front.jpg",
                    "alt": "Front view of the elegant Winter dress"
                },
                {
                    "id": "9f4f1225-d6e4-4d5d-80e9-7b5cefc86bda",
                    "product_id": "fa820373-7028-4c31-93e2-40751265ed1d",
                    "url": "https://example.com/images/dress_back.jpg",
                    "alt": "Back view of the elegant Winter dress"
                }
            ]
        },
        {
            "id": "f4580b7c-9b9d-463d-b5d2-4dbc5ab11acb",
            "name": "Cosmic Explorer Jacket",
            "description": "A high-tech jacket designed for space enthusiasts. Features built-in LED lights and temperature control",
            "active": true,
            "price": "199.99",
            "stock": 25,
            "created_at": "2024-08-30T18:23:48.268Z",
            "category_id": 7,
            "category": "Hoodies",
            "color_id": 4,
            "color": "Black",
            "size_id": 3,
            "size": "L",
            "gender_id": 2,
            "gender": "Female",
            "images": [
                {
                    "id": "7ed25c6a-afd4-4262-b9bc-3fc8a25761f1",
                    "product_id": "f4580b7c-9b9d-463d-b5d2-4dbc5ab11acb",
                    "url": "https://example.com/images/jacket_front.jpg",
                    "alt": "Front view of the Cosmic Explorer Jacket"
                },
                {
                    "id": "a6e721ac-d430-4420-a7cc-19bacada5216",
                    "product_id": "f4580b7c-9b9d-463d-b5d2-4dbc5ab11acb",
                    "url": "https://example.com/images/jacket_back.jpg",
                    "alt": "Back view of the Cosmic Explorer Jacket"
                },
                {
                    "id": "bb21435e-88c1-4cc9-bd89-6ceebe40bf08",
                    "product_id": "f4580b7c-9b9d-463d-b5d2-4dbc5ab11acb",
                    "url": "https://example.com/images/jacket_detail.jpg",
                    "alt": "Detail view showing LED lights and temperature control"
                }
            ]
        }
    ]
}