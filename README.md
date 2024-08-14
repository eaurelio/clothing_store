# Clothing Store API

## Overview

Welcome to the Clothing Store API! This RESTful API is designed to manage all aspects of a clothing store, including users, products, orders, and wishlists. Built with Node.js and TypeScript, and using SQLite for data storage, the API follows a three-layer architecture for simplicity and maintainability.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture](#architecture)
4. [Entities](#entities)
    - [User](#user)
    - [Product](#product)
    - [Order](#order)
    - [Wishlist](#wishlist)
5. [Usage](#usage)
    - [Endpoints](#endpoints)
    - [Error Handling](#error-handling)
6. [Logging](#logging)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **User Management**: Register new users, log in, and update user profiles.
- **Product Management**: Create, read, update, and delete products.
- **Order Management**: Place and manage customer orders.
- **Wishlist Management**: Create, update, and delete wishlists.
- **Data Validation**: Ensures data integrity with Zod.
- **Structured Logging**: Keeps track of operations using Winston.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **TypeScript**: Adds type safety and clarity to the code.
- **Knex.js**: SQL query builder for database interactions.
- **SQLite**: Lightweight database engine.
- **Zod**: Data validation library.
- **Winston**: Logger for tracking and debugging.

## Architecture

The API is organized into three main layers:

1. **Controller**: Handles HTTP requests and responses, and uses Zod for data validation.
2. **Business Logic**: Contains the core application logic and data transformation.
3. **Database**: Manages direct interactions with the SQLite database.

## Entities

### User

- **Purpose**: Manage user accounts.
- **Operations**: Registration, login, profile updates.

### Product

- **Purpose**: Manage product details.
- **Operations**: Create, update, read, and delete product information.

### Order

- **Purpose**: Manage customer orders.
- **Operations**: Place and track orders, view order status.

### Wishlist

- **Purpose**: Manage user wishlists.
- **Operations**: Create, update, view, and delete wishlists.

## Usage

### Endpoints

#### User Endpoints

The User endpoints manage user accounts, including registration, login, profile updates, and phone management. Each endpoint provides a specific functionality related to user data.

#### **1. Create User**

- **Endpoint**: `/createUser`
- **Method**: `POST`
- **Description**: Registers a new user with the provided details.
- **Request Body**:
  ```json
  {
    "personal_id": "string",
    "entity_type": "string",
    "name": "string",
    "email": "string",
    "password": "string",
    "birthdate": "YYYY-MM-DD",
    "address": "string",
    "number": "string",
    "neighborhood": "string",
    "city": "string",
    "country": "string",
    "gender": "string",
    "phones": [
      {
        "phoneId": "string",
        "number": "string",
        "type": "string"
      }
    ]
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "message": "User created successfully",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "createdAt": "ISO8601-date",
        "token": "string"
      }
    }
    ```
  - **400 Bad Request**: If the input data is invalid.
  - **409 Conflict**: If the email or personal ID already exists.

#### **2. Login**

- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Login has been successfully",
      "user": {
        "userId": "string",
        "name": "string",
        "email": "string",
        "token": "string"
      }
    }
    ```
  - **400 Bad Request**: If the email or password is incorrect.
  - **404 Not Found**: If the user is not registered.

#### **3. Get User Data**

- **Endpoint**: `/getUserData/:id`
- **Method**: `POST`
- **Description**: Retrieves detailed information for a specific user, including their phones.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "id": "string",
      "personal_id": "string",
      "entity_type": "string",
      "name": "string",
      "email": "string",
      "birthdate": "YYYY-MM-DD",
      "address": "string",
      "number": "string",
      "neighborhood": "string",
      "city": "string",
      "country": "string",
      "gender": "string",
      "phones": [
        {
          "phone_id": "string",
          "number": "string",
          "type": "string"
        }
      ]
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **404 Not Found**: If the user does not exist.

#### **4. Get All Users**

- **Endpoint**: `/getAllUsers`
- **Method**: `POST`
- **Description**: Retrieves a list of all users, with optional query parameter for search.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Query Parameters**:
  - `q`: Optional search query (string)
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "createdAt": "ISO8601-date",
        "phones": [
          {
            "phone_id": "string",
            "number": "string",
            "type": "string"
          }
        ]
      }
    ]
    ```
  - **401 Unauthorized**: If the token is invalid or the user is not an admin.
  - **404 Not Found**: If no users are found.

#### **5. Edit User**

- **Endpoint**: `/editUser/:id`
- **Method**: `PATCH`
- **Description**: Updates user details.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Request Body**:
  ```json
  {
    "personal_id": "string",
    "entity_type": "string",
    "name": "string",
    "email": "string",
    "password": "string",
    "birthdate": "YYYY-MM-DD",
    "address": "string",
    "number": "string",
    "neighborhood": "string",
    "city": "string",
    "country": "string",
    "gender": "string",
    "phones": [
      {
        "phoneId": "string",
        "number": "string",
        "type": "string"
      }
    ]
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Editing completed successfully",
      "user": {
        "userId": "string",
        "name": "string",
        "email": "string",
        "createdAt": "ISO8601-date"
      }
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **404 Not Found**: If the user does not exist.

#### **6. Change Password**

- **Endpoint**: `/changePassword/:id`
- **Method**: `PATCH`
- **Description**: Changes the password for the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Request Body**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Password updated successfully"
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **400 Bad Request**: If the old password is incorrect.

#### **7. Add Phone**

- **Endpoint**: `/addPhone/:id`
- **Method**: `POST`
- **Description**: Adds a new phone number to the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Request Body**:
  ```json
  {
    "phoneId": "string",
    "number": "string",
    "type": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Phone updated successfully",
      "phones": [
        {
          "phone_id": "string",
          "number": "string",
          "type": "string"
        }
      ]
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **404 Not Found**: If the user does not exist.

#### **8. Update Phone**

- **Endpoint**: `/updatePhone/:id`
- **Method**: `PATCH`
- **Description**: Updates the phone number for the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Request Body**:
  ```json
  {
    "phoneId": "string",
    "number": "string",
    "type": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Phone updated successfully",
      "phones": [
        {
          "phone_id": "string",
          "number": "string",
          "type": "string"
        }
      ]
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **404 Not Found**: If the phone does not exist or does not belong to the user.

#### **9. Delete Phone**

- **Endpoint**: `/deletePhone/:id`
- **Method**: `DELETE`
- **Description**: Deletes a phone number from the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID
- **Request Body**:
  ```json
  {
    "phoneId": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Phone deleted successfully",
      "phones": [
        {
          "phone_id": "string",
          "number": "string",
          "type": "string"
        }
      ]
    }
    ```
  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **404 Not Found**: If the phone does not exist or does not belong to the user.

#### Product Endpoints

#### 1. **Get Product by ID**
- **URL:** `/getProduct/:id`
- **Method:** `GET`
- **Description:** Retrieve detailed information about a specific product by its ID.
- **URL Params:**
  - `id=[integer]` - The ID of the product.
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "product": {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "stock": "number",
        "createdAt": "string",
        "category": "string",
        "color": "string",
        "size": "string",
        "gender": "string"
      }
    }
    ```
- **Error Responses:**
  - **Code:** 404
  - **Content:**
    ```json
    {
      "error": "Product not found"
    }
    ```

#### 2. **Get All Products**
- **URL:** `/getAllProducts`
- **Method:** `GET`
- **Description:** Retrieve a list of all products with optional filters.
- **Body Params:**
  - `name=[string]` - Filter by product name.
  - `category_id=[integer]` - Filter by category ID.
  - `color_id=[integer]` - Filter by color ID.
  - `size_id=[integer]` - Filter by size ID.
  - `gender_id=[integer]` - Filter by gender ID.
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "products": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "price": "number",
          "stock": "number",
          "createdAt": "string",
          "category": "string",
          "color": "string",
          "size": "string",
          "gender": "string"
        }
      ]
    }
    ```
- **Error Responses:**
  - **Code:** 400
  - **Content:**
    ```json
    {
      "error": "Invalid filters"
    }
    ```

#### 3. **Create Product**
- **URL:** `/createProduct`
- **Method:** `POST`
- **Description:** Create a new product.
- **Body Params:**
  - `name=[string]` - Name of the product.
  - `description=[string]` - Description of the product.
  - `price=[number]` - Price of the product.
  - `stock=[number]` - Stock quantity of the product.
  - `category_id=[integer]` - ID of the product category.
  - `color_id=[integer]` - ID of the product color.
  - `size_id=[integer]` - ID of the product size.
  - `gender_id=[integer]` - ID of the product gender.
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "message": "Product created successfully",
      "product": {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "stock": "number",
        "createdAt": "string",
        "category_id": "integer",
        "color_id": "integer",
        "size_id": "integer",
        "gender_id": "integer"
      }
    }
    ```
- **Error Responses:**
  - **Code:** 400
  - **Content:**
    ```json
    {
      "error": "Invalid product data"
    }
    ```
  - **Code:** 409
  - **Content:**
    ```json
    {
      "error": "'name' already exists"
    }
    ```

#### 4. **Update Product**
- **URL:** `/updateProduct/:id`
- **Method:** `PATCH`
- **Description:** Update an existing product by its ID.
- **URL Params:**
  - `id=[integer]` - The ID of the product to update.
- **Body Params:**
  - `name=[string]` - New name of the product.
  - `description=[string]` - New description of the product.
  - `price=[number]` - New price of the product.
  - `stock=[number]` - New stock quantity of the product.
  - `category_id=[integer]` - New category ID.
  - `color_id=[integer]` - New color ID.
  - `size_id=[integer]` - New size ID.
  - `gender_id=[integer]` - New gender ID.
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "message": "Editing completed successfully",
      "product": {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "stock": "number",
        "createdAt": "string",
        "category_id": "integer",
        "color_id": "integer",
        "size_id": "integer",
        "gender_id": "integer"
      }
    }
    ```
- **Error Responses:**
  - **Code:** 400
  - **Content:**
    ```json
    {
      "error": "Invalid product data"
    }
    ```
  - **Code:** 404
  - **Content:**
    ```json
    {
      "error": "Product not found"
    }
    ```

---

### Auxiliary Fields Endpoints

#### 5. **Get All Categories**
- **URL:** `/getAllCategories`
- **Method:** `GET`
- **Description:** Retrieve a list of all product categories.
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "categories": [
        {
          "id": "string",
          "name": "string",
          "description": "string"
        }
      ]
    }
    ```

#### 6. **Create Category**
- **URL:** `/createCategory`
- **Method:** `POST`
- **Description:** Create a new product category.
- **Body Params:**
  - `name=[string]` - Name of the category.
  - `description=[string]` - Description of the category.
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "message": "Category created successfully",
      "category": {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    }
    ```

#### 7. **Update Category**
- **URL:** `/updateCategory/:id`
- **Method:** `PATCH`
- **Description:** Update an existing product category by its ID.
- **URL Params:**
  - `id=[integer]` - The ID of the category to update.
- **Body Params:**
  - `name=[string]` - New name of the category.
  - `description=[string]` - New description of the category.
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "message": "Category updated successfully",
      "category": {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    }
    ```

### Order Endpoints

#### Create Order

- **URL:** `/createOrder`
- **Method:** `POST`
- **Description:** Creates a new order with specified items and details.
- **Request Headers:**
  - `Authorization`: Bearer token (e.g., `Bearer <token>`)
- **Request Body:**
  ```json
  {
    "items": [
      {
        "productId": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "status_id": "string",
    "total": "number"
  }
  ```
- **Response:**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "message": "Order created successfully",
      "order": {
        "orderId": "string",
        "userId": "string",
        "orderDate": "string",
        "status": "string",
        "total": "number",
        "items": [
          {
            "itemId": "string",
            "productId": "string",
            "quantity": "number",
            "price": "number"
          }
        ]
      }
    }
    ```

#### Get Order

- **URL:** `/getOrder/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific order by its ID.
- **Request Headers:**
  - `Authorization`: Bearer token (e.g., `Bearer <token>`)
- **Request Parameters:**
  - `id`: Order ID
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "order": {
        "orderId": "string",
        "userId": "string",
        "status_name": "string",
        "total": "number",
        "orderDate": "string",
        "items": [
          {
            "itemId": "string",
            "productId": "string",
            "quantity": "number",
            "price": "number"
          }
        ]
      }
    }
    ```

#### Get All Orders

- **URL:** `/getAllOrders`
- **Method:** `GET`
- **Description:** Retrieves all orders for the authenticated user.
- **Request Headers:**
  - `Authorization`: Bearer token (e.g., `Bearer <token>`)
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "orders": [
        {
          "orderId": "string",
          "userId": "string",
          "status_name": "string",
          "total": "number",
          "orderDate": "string",
          "items": [
            {
              "itemId": "string",
              "productId": "string",
              "quantity": "number",
              "price": "number"
            }
          ]
        }
      ]
    }
    ```

#### Get All Statuses

- **URL:** `/getAllStatus`
- **Method:** `GET`
- **Description:** Retrieves all possible statuses for orders.
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    [
      {
        "status_id": "string",
        "status_name": "string"
      }
    ]
    ```

#### Update Order

- **URL:** `/updateOrder/:id`
- **Method:** `PATCH`
- **Description:** Updates an existing order with new details.
- **Request Headers:**
  - `Authorization`: Bearer token (e.g., `Bearer <token>`)
- **Request Parameters:**
  - `id`: Order ID
- **Request Body:**
  ```json
  {
    "status_id": "string",
    "items": [
      {
        "productId": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "total": "number"
  }
  ```
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Order updated successfully",
      "order": {
        "orderId": "string",
        "userId": "string",
        "orderDate": "string",
        "status": "string",
        "total": "number",
        "items": [
          {
            "itemId": "string",
            "productId": "string",
            "quantity": "number",
            "price": "number"
          }
        ]
      }
    }
    ```

#### Delete Order

- **URL:** `/deleteOrder/:id`
- **Method:** `DELETE`
- **Description:** Deletes a specific order by its ID if the status allows.
- **Request Headers:**
  - `Authorization`: Bearer token (e.g., `Bearer <token>`)
- **Request Parameters:**
  - `id`: Order ID
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Order deleted successfully"
    }
    ```

### Wishlist Endpoints

#### Create Wishlist

- **URL:** `/createWishList`
- **Method:** `POST`
- **Description:** Creates a new wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "items": [
      {
        "productId": "string"
      }
    ]
  }
  ```
- **Response:**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "message": "Wishlist created successfully",
      "wishlistId": "string",
      "items": [
        {
          "wishlistId": "string",
          "productId": "string"
        }
      ]
    }
    ```

#### Get Wishlist

- **URL:** `/getWishList`
- **Method:** `GET`
- **Description:** Retrieves the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "wishlist": {
        "wishlist_id": "string",
        "userId": "string",
        "created_at": "string",
        "items": [
          {
            "wishlistId": "string",
            "productId": "string"
          }
        ]
      }
    }
    ```

#### Update Wishlist

- **URL:** `/updateWishList`
- **Method:** `PATCH`
- **Description:** Updates the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "items": [
      {
        "productId": "string"
      }
    ]
  }
  ```
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Wishlist updated successfully",
      "wishlist": {
        "wishlist_id": "string",
        "userId": "string",
        "created_at": "string",
        "items": [
          {
            "wishlistId": "string",
            "productId": "string"
          }
        ]
      }
    }
    ```

#### Delete Wishlist

- **URL:** `/deleteWishList`
- **Method:** `DELETE`
- **Description:** Deletes the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Wishlist deleted successfully"
    }
    ```

### Error Handling

- **401 Unauthorized:** Invalid or missing token.
- **404 Not Found:** Wishlist not found for the authenticated user.