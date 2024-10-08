# Clothing Store API

## Overview

Welcome to the Clothing Store API! This RESTful API is designed to manage all aspects of a clothing store, including users, products, orders, wishlists and support tickets. Built with Node.js and TypeScript, and using Postgre for data storage, the API follows a three-layer architecture for simplicity and maintainability.

## Documentation on Postman

1; [Postman Documentation](https://documenter.getpostman.com/view/24823115/2sAXjKZsDM#intro)

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture](#architecture)
4. [Entities](#entities)
   - [User](#user)
   - [Product](#product)
   - [Order](#order)
   - [Wishlist](#wishlist)
   - [Tickets](#tickets)
5. [Installation](#installation)
6. [Testing](#testing-with-user-accounts)
7. [Usage](#usage)
   - [Endpoints](#endpoints)
     - [Users](#user-endpoints)
     - [Products](#products-endpoints)
     - [Orders](#orders-endpoints)
     - [WishLists](#wish-list-endpoints)
     - [Tickets](#tickets-endpoints)
8. [Error Handling](#error-handling)
9. [Logging](#logging)
10. [Testing](#testing)
11. [Database Documentation](database_readme.md)

## Features

- **User Management**: Register new users, log in, and update user profiles.
- **Product Management**: Create, read, update, and delete products.
- **Order Management**: Place and manage customer orders.
- **Wishlist Management**: Create, update, and delete wishlists.
- **Tickets Management**: Create requests for the support team.
- **Data Validation**: Ensures data integrity with Zod.
- **Structured Logging**: Keeps track of operations using Winston.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **TypeScript**: Adds type safety and clarity to the code.
- **Express**: Web framework for Node.js, used to build RESTful APIs by defining routes and managing HTTP requests.
- **Knex.js**: SQL query builder for database interactions.
- **PostgreSQL**: Powerful database engine.
- **Zod**: Data validation library.
- **Winston**: Logger for tracking and debugging.

## Architecture

The API is organized into three main layers:

1. **Controller**: Handles HTTP requests and responses, and uses Zod for data validation.
2. **Business Logic**: Contains the core application logic and data transformation.
3. **Database**: Manages direct interactions with the Postgre database.

### Security Middlewares

To enhance the security of the API, the following middlewares are implemented:

- **Authentication Middleware**: Ensures that only authenticated users can access certain endpoints. It validates JWT tokens provided in the `Authorization` header.
- **Authorization Middleware**: Controls access to endpoints based on user roles, ensuring that only users with the appropriate permissions can perform specific actions.

### Database Triggers

The database uses PostgreSQL, and the following triggers are implemented to maintain data integrity and support audit logging:

- **Audit Trigger**: Automatically logs any changes made to critical tables, such as `products`, `orders`, and `users`. This includes capturing the old values before updates or deletions for audit purposes.
- **Cascade Deletion Trigger**: Ensures that related records are appropriately deleted when a parent record is removed, maintaining referential integrity.

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

### Tickets

- **Purpose**: Manage client requests.
- **Operations**: Create, update and finish support requests.

## Installation

To set up and run the Clothing Store API, follow these steps:

1. **Start Containers and Build the Application**:

   - Navigate to the directory containing the `docker-compose.yml` file.
   - Run the following command to start the containers and build the application:

     ```bash
     docker-compose up -d --build
     ```

2. **Restore the Database Backup**:

   - Since the backup file (`backup.sql`) is located in the root of the project, follow these steps to restore it:

     - **Copy the backup to the PostgreSQL container**:

       ```bash
       docker cp backup.sql <your_postgres_container_name>:/backup.sql
       ```

       Replace `<your_postgres_container_name>` with the name of your PostgreSQL container.

     - **Access the PostgreSQL container**:

       ```bash
       docker exec -it <your_postgres_container_name> sh
       ```

       Again, replace `<your_postgres_container_name>` with the name of your PostgreSQL container.

     - **Within the container, restore the backup**:

       ```sh
       psql -U postgres -d <your_database_name> -f /backup.sql
       ```

       Replace `<your_database_name>` with the name of the database you are restoring.

3. **Verify the Application**:
   - Ensure the application is running by visiting [http://localhost:<your_port>](http://localhost:<your_port>).

## Testing with User Accounts

To test the API, you can log in with one of the following pre-created accounts to receive a token:

1. **Client Account**

   - **Email:** client@solvd.com
   - **Password:** SolvdPass#2024

   **Login Request:**

   ```http
   POST users/login
   Content-Type: application/json

   {
      "email": "client@solvd.com",
      "password": "SolvdPass#2024",
   }
   ```

2. **Admin Account**

   - **Email:** admin@solvd.com
   - **Password:** AdminPass#2024

   **Login Request:**

   ```http
   POST users/login
   Content-Type: application/json

   {
     "email": "admin@solvd.com",
     "password": "SolvdPass#2024"
   }
   ```

## Usage

### Endpoints

#### User Endpoints

The User endpoints manage user accounts, including registration, login, profile updates, and phone management. Each endpoint provides a specific functionality related to user data.

#### **1. Create User**

- **Endpoint**: `users/createUser`
- **Method**: `POST`
- **Description**: Registers a new user with the provided details. By default, this route creates users with the `CLIENT` role. However, if a user with an `ADMIN` token makes the request, they can specify the `role` parameter as `ADMIN` to create an admin user.
- **Request Headers:**

  - `Authorization`: No needed

- **Request Body**:

  ```json
  {
    "personalId": "string",
    "entityType": "string",
    "name": "string",
    "email": "string",
    "password": "string",
    "birthdate": "YYYY-MM-DD",
    "role": "string", // Optional, default is "CLIENT". Can be "ADMIN" if authorized.
    "address": "string",
    "number": "string",
    "neighborhood": "string",
    "city": "string",
    "country": "string",
    "gender": "string",
    "phones": [
      {
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
  - **403 Forbidden**: If a non-admin user attempts to create an admin account.

- **Controller Method Overview**:
  - **Input**: Receives a `CreateUserInputDTO` with fields including `personalId`, `entityType`, `name`, `email`, `password`, `birthdate`, `role`, `address`, `number`, `neighborhood`, `city`, `country`, `gender`, and an array of `phones`.
  - **Authorization**: By default, creates a `CLIENT` user. If a valid `ADMIN` token is provided, the `role` parameter can be set to `ADMIN` to create an admin user. Only users with the `ADMIN` role can create another `ADMIN` account.
  - **Business Logic**: Checks for existing users with the same email or personal ID, hashes the password, generates a new user ID, and inserts the user and their phone numbers into the database.
  - **Token**: Generates a JWT token for the newly created user, included in the response.
  - **Output**: Returns a success message, along with the newly created user’s ID, name, email, creation date, and JWT token.

#### **2. Login**

- **Endpoint**: `users/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Headers:**

  - `Authorization`: No needed

- **Request Body**:

  ```json
  {
    "email": "li.wei@example.cn",
    "password": "ChinaPass#2024"
  }
  ```

- **Responses**:

  - **200 OK**:
    ```json
    {
      "message": "Login has been successfully",
      "user": {
        "userId": "8fceaae0-b3c7-4ce7-9318-20037194c05b",
        "name": "Li Wei",
        "email": "li.wei@example.cn",
        "token": "eyJ1c2VySWQiOiI4ZmNlYWFlMC1iM2M3LTRjZTctOTMxOC0yMDAzNzE5NGMwNWIiLCJyb2xlIjoiQ0xJRU5UIiwiY3JlYXRlZEF0IjoxNzI0OTUzOTU4NjIwLCJleHBpcmVzQXQiOjE3MjU1NTg3NTg2MjB9.lVULqZShCCihVkq8PhkUzQxwEpMIlyqBw8ZcCuyPv3g="
      }
    }
    ```
  - **400 Bad Request**: If the email or password is incorrect.
  - **403 Forbidden**: If the user account is deactivated.
  - **404 Not Found**: If the user is not registered.

- **Controller Method Overview**:
  - **Input**: Receives a `LoginInputDTO` with the `email` and `password`.
  - **Business Logic**:
    - Looks up the user by email.
    - Checks if the user exists and if the account is active.
    - Verifies the provided password against the stored hashed password.
    - Updates the user's last login timestamp.
    - Generates a JWT token with the user's ID and role.
  - **Output**: Returns a success message, along with the user's ID, name, email, and a JWT token.

#### **3. Get User By Id**

- **Endpoint**: `users/getUserById/:id`
- **Method**: `POST`
- **Description**: Retrieves detailed information for a specific user, including their phones. This endpoint allows users to obtain their own data using their authentication token.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID (path parameter)
- **Responses**:

  - **200 OK**:

    ```json
    {
      "id": "1aa7b223-8843-4efc-9007-c0eb5763f7ff",
      "personal_id": "1378901234",
      "entity_type": "PERSONAL",
      "name": "Chloe Smith",
      "gender_id": 2,
      "gender": "Female",
      "email": "chloe.smith@example.ca",
      "role": "CLIENT",
      "created_at": "2024-08-21T23:38:47.161Z",
      "birthdate": "1996-04-18T03:00:00.000Z",
      "address": "101 Toronto Street",
      "number": "3",
      "neighborhood": "Downtown",
      "city": "Toronto",
      "country": "Canada",
      "active": true,
      "last_login": "2024-08-23T15:10:50.171Z",
      "phones": [
        {
          "phone_id": "39bdf530-6b42-4561-b7c3-408870ae2294",
          "user_id": "1aa7b223-8843-4efc-9007-c0eb5763f7ff",
          "number": "+1-416-123-4567",
          "type": "Mobile"
        },
        {
          "phone_id": "fa969f76-4d3b-4773-a5ca-ecbddcb27e84",
          "user_id": "1aa7b223-8843-4efc-9007-c0eb5763f7ff",
          "number": "+1-416-234-5678",
          "type": "Home"
        }
      ]
    }
    ```

  - **401 Unauthorized**: If the token is invalid or the user does not have access.
  - **403 Forbidden**: If the user account is deactivated.
  - **404 Not Found**: If the user does not exist.

- **Controller Method Overview**:
  - **Input**: Receives the `userId` as a parameter and the token from the headers.
  - **Business Logic**:
    - Fetches the user data from the database by `userId`.
    - Checks if the user exists and if the account is active.
    - Retrieves the associated phone numbers for the user.
    - Omits the user's password from the response.
  - **Output**: Returns detailed user information including phones, with sensitive data like the password excluded.

#### **4. Get All Users**

- **Endpoint**: `users/getUsers`
- **Method**: `POST`
- **Description**: Retrieves a list of all users with optional query parameters for search and filtering. This endpoint is restricted to users with admin roles.
- **Request Headers**:
  - `Authorization`: Bearer token (Admin token required)
- **Query Parameters**:
  - `q`: Optional search query (string) to filter by name.
- **Request Parameters:**
  - `onlyActive` (optional)
  - `personalId` (optional)
  - `genderId` (optional)
  - `email` (optional)
  - `role` (optional)
- **Request Body** (all optional parameters):

  ```json
  {
    "onlyActive": false,
    "personalId": "string",
    "genderId": "string",
    "email": "string",
    "role": "string"
  }
  ```

- **Responses**:

  - **200 OK**:

    ```json
    [
      {
        "id": "string",
        "personal_id": "string",
        "entity_type": "string",
        "name": "string",
        "gender_id": "integer",
        "gender": "string",
        "email": "string",
        "role": "string",
        "created_at": "ISO8601-date",
        "birthdate": "ISO8601-date",
        "address": "string",
        "number": "string",
        "neighborhood": "string",
        "city": "string",
        "country": "string",
        "active": "boolean",
        "last_login": "ISO8601-date",
        "phones": [
          {
            "phone_id": "string",
            "user_id": "string",
            "number": "string",
            "type": "string"
          }
        ]
      }
    ]
    ```

  - **401 Unauthorized**: If the token is invalid or the user is not an admin.
  - **404 Not Found**: If no users are found matching the criteria.

#### **5. Edit User**

- **Endpoint**: `users/editUser/:id`
- **Method**: `PATCH`
- **Description**: Updates user details.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID (path parameter)
- **Request Body**:
  ```json
  {
    "personalId": "string",
    "entityType": "string",
    "name": "string",
    "email": "string",
    "password": "string",
    "birthdate": "YYYY-MM-DD",
    "address": "string",
    "number": "string",
    "neighborhood": "string",
    "city": "string",
    "country": "string",
    "gender": "string"
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

- **Endpoint**: `users/changePassword`
- **Method**: `PATCH`
- **Description**: Changes the password for the user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Request Body**:
  ```json
  {
    "userId": "string",
    "email": "string",
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
  - **400 Bad Request**: If the old password is incorrect, the email does not match, or the new password is the same as the old password.

#### **7. Reset Password**

- **Endpoint**: `users/resetPassword`
- **Method**: `PATCH`
- **Description**: Resets the password for any user. This endpoint is restricted to admin users who can reset passwords for other users using their admin token.
- **Request Headers**:
  - `Authorization`: Bearer token (Admin token required)
- **Request Body**:
  ```json
  {
    "userId": "string",
    "email": "string",
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
  - **401 Unauthorized**: If the token is invalid or the user is not an admin.
  - **400 Bad Request**: If the email does not match, or if the request has invalid data.
  - **404 Not Found**: If the user does not exist.

#### **8. Toggle User Active Status**

- **Endpoint**: `users/toggleActiveStatus`
- **Method**: `PATCH`
- **Description**: Toggles the active status of a user.
- **Request Headers**:
  - `Authorization`: No needed
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
      "message": "User activated successfully"
    }
    ```
  - **400 Bad Request**: If the password is incorrect.
  - **404 Not Found**: If the user does not exist.

#### **9. Add Phone**

- **Endpoint**: `users/addPhone/:id`
- **Method**: `POST`
- **Description**: Adds a new phone number to the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID (path parameter)
- **Request Body**:
  ```json
  {
    "number": "string",
    "type": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Phone added successfully",
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

#### **10. Update Phone**

- **Endpoint**: `users/updatePhone/:id`
- **Method**: `PATCH`
- **Description**: Updates the phone number for the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID (path parameter)
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

#### **11. Delete Phone**

- **Endpoint**: `users/deletePhone/:id`
- **Method**: `DELETE`
- **Description**: Deletes a phone number from the specified user.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Parameters**:
  - `id`: User ID (path parameter)
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

### Products Endpoints

### **1. Create Product**

- **URL:** `products/createProduct`
- **Method:** `POST`
- **Description:** Creates a new product with specified details.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "categoryId": "string",
    "colorId": "string",
    "sizeId": "string",
    "genderId": "string",
    "images": [
      {
        "url": "string",
        "alt": "string"
      }
    ]
  }
  ```
- **Responses:**
  - **201 Created**:
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
        "categoryId": "string",
        "colorId": "string",
        "sizeId": "string",
        "genderId": "string",
        "images": [
          {
            "id": "string",
            "url": "string",
            "alt": "string"
          }
        ]
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid or missing required fields.
  - **409 Conflict**: If the product name already exists.

### **2. Get Products**

- **URL:** `products/getProducts`
- **Method:** `GET`
- **Description:** Retrieves a list of products based on specified filters.
- **Request Headers:**
  - `Authorization`: No needed
- **Request Parameters:**
  - `id` (optional): Product ID
  - `name` (optional): Product name
  - `categoryId` (optional): Category ID
  - `colorId` (optional): Color ID
  - `sizeId` (optional): Size ID
  - `genderId` (optional): Gender ID
  - `active` (optional): Boolean indicating if the product is active (default: true)
- **Responses:**
  - **200 OK**:
    ```json
    {
      "products": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "active": true,
          "price": "number",
          "stock": "number",
          "created_at": "string",
          "category_id": "string",
          "category": "string",
          "color_id": "string",
          "color": "string",
          "size_id": "string",
          "size": "string",
          "gender_id": "string",
          "gender": "string",
          "images": [
            {
              "id": "string",
              "url": "string",
              "alt": "string"
            }
          ]
        }
      ]
    }
    ```

### **3. Edit Product**

- **URL:** `products/editProduct`
- **Method:** `PUT`
- **Description:** Updates an existing product.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Parameters:**
  - `id` (optional)
  - `name` (optional)
  - `description` (optional)
  - `price` (optional)
  - `stock` (optional)
  - `categoryId` (optional)
  - `colorId` (optional)
  - `sizeId` (optional)
  - `genderId` (optional)
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "categoryId": "string",
    "colorId": "string",
    "sizeId": "string",
    "genderId": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
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
        "categoryId": "string",
        "colorId": "string",
        "sizeId": "string",
        "genderId": "string",
        "images": [
          {
            "id": "string",
            "url": "string",
            "alt": "string"
          }
        ]
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid or missing required fields.
  - **404 Not Found**: If the product is not found.

### **4. Insert Product Image**

- **URL:** `products/insertProductImage`
- **Method:** `POST`
- **Description:** Inserts a new image for a specified product.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "productId": "string",
    "url": "string",
    "alt": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
    ```json
    {
      "message": "Image inserted successfully",
      "images": [
        {
          "id": "string",
          "url": "string",
          "alt": "string"
        }
      ]
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **409 Conflict**: If the image URL already exists for the product.

### **5. Delete Product Image**

- **URL:** `products/deleteProductImage`
- **Method:** `DELETE`
- **Description:** Deletes a product image.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "id": "string",
    "productId": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
    ```json
    {
      "message": "Image deleted successfully",
      "images": [
        {
          "id": "string",
          "url": "string",
          "alt": "string"
        }
      ]
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the image is not found.
  - **403 Forbidden**: If the image does not belong to the specified product.

### **6. Toggle Product Active Status**

- **URL:** `products/toggleProductActiveStatus/:id`
- **Method:** `PATCH`
- **Description:** Toggles the active status of a product.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Parameters**:

  - `id`: ProductID (path parameter)

- **Responses:**
  - **200 OK**:
    ```json
    {
      "message": "Product activated/deactivated successfully"
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the product is not found.

### **7. Get All Categories**

- **URL:** `products/getAllCategories`
- **Method:** `GET`
- **Description:** Retrieves a list of all product categories.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    ]
    ```

### **8. Create Category**

- **URL:** `products/createCategory`
- **Method:** `POST`
- **Description:** Creates a new product category.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
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
  - **400 Bad Request**: If the category name already exists.

### **9. Update Category**

- **URL:** `products/updateCategory/:id`
- **Method:** `PUT`
- **Description:** Updates an existing product category.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
  - **Parameters**:
  - `id`: Category ID (path parameter)
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
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
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the category is not found.

### **10. Get All Colors**

- **URL:** `products/getAllColors`
- **Method:** `GET`
- **Description:** Retrieves a list of all product colors.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:

```json
[
  {
    "id": "string",
    "name": "string",
    "hex_code": "string"
  }
]
```

### **11. Create Color**

- **URL:** `products/createColor`
- **Method:** `POST`
- **Description:** Creates a new product color.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "name": "string",
    "hexCode": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
    ```json
    {
      "message": "Color created successfully",
      "color": {
        "id": "string",
        "name": "string",
        "hex_code": "string"
      }
    }
    ```
  - **400 Bad Request**: If the color name already exists.

### **12. Update Color**

- **URL:** `products/updateColor/:id`
- **Method:** `PUT`
- **Description:** Updates an existing product color.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Parameters**:
- `id`: color ID (path parameter)
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string",
    "hex_code": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
    ```json
    {
      "message": "Color updated successfully",
      "color": {
        "id": "string",
        "name": "string",
        "hex_code": "string"
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the color is not found.

### **13. Get All Sizes**

- **URL:** `products/getAllSizes`
- **Method:** `GET`
- **Description:** Retrieves a list of all product sizes.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string"
      }
    ]
    ```

### **14. Create Size**

- **URL:** `products/createSize`
- **Method:** `POST`
- **Description:** Creates a new product size.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
    ```json
    {
      "message": "Size created successfully",
      "size": {
        "id": "string",
        "name": "string"
      }
    }
    ```
  - **400 Bad Request**: If the size name already exists.

### **15. Update Size**

- **URL:** `products/updateSize/:id`
- **Method:** `PUT`
- **Description:** Updates an existing product size.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Parameters**:
- `id`: Size ID (path parameter)
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
    ```json
    {
      "message": "Size updated successfully",
      "size": {
        "id": "string",
        "name": "string"
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the size is not found.

### **16. Get All Genders**

- **URL:** `products/getAllGenders`
- **Method:** `GET`
- **Description:** Retrieves a list of all product genders.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string"
      }
    ]
    ```

### **17. Create Gender**

- **URL:** `products/createGender`
- **Method:** `POST`
- **Description:** Creates a new product gender.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
    ```json
    {
      "message": "Gender created successfully",
      "gender": {
        "id": "string",
        "name": "string"
      }
    }
    ```
  - **400 Bad Request**: If the gender name already exists.

### **18 .Update Gender**

- **URL:** `products/updateGender/:id`
- **Method:** `PUT`
- **Description:** Updates an existing product gender.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Parameters**:
- `id`: Gender ID (path parameter)
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string"
  }
  ```
- **Responses:**

  - **200 OK**:
    ```json
    {
      "message": "Gender updated successfully",
      "gender": {
        "id": "string",
        "name": "string"
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **404 Not Found**: If the gender is not found.

  ### Orders Endpoints

  ### **1. Create Order**

- **URL:** `orders/createOrder`
- **Method:** `POST`
- **Description:** Creates a new order with specified items and details.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Body:**
  ```json
  {
    "userId": "string",
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
- **Responses:**

  - **201 Created**:

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

  - **400 Bad Request**: If the request body is invalid or missing required fields.
  - **401 Unauthorized**: If the token is invalid or missing.
  - **403 Forbidden**: If the user does not have permission to create an order.
  - **404 Not Found**: If any of the specified products are not found or inactive.

- **Controller Method Overview**:
  - **Input**: Receives `userId`, `items`, and `total` from the request body and the token from the headers.
  - **Business Logic**:
    - Validates the token and checks for required permissions.
    - Validates the items, ensuring all products are found and active.
    - Creates the new order and stores it in the database.
  - **Output**: Returns a success message and details of the created order.

### **2. Get User Orders**

- **Endpoint**: `orders/getUserOrders/`
- **Method**: `GET`
- **Description**: Retrieves a specific order by its ID or all orders for a specific user. If `orderId` is provided, retrieves that specific order. If `orderId` is not provided, retrieves all orders for the specified `userId`.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Request Body**
  ```json
  {
    "userId": "d1c5b5e7-ab95-4f48-b8de-c89de4eea640",
    "orderId": "c8db9d25-5a61-4f79-9b54-4544e7f46982"
  }
  ```
  - **userId** (required): User ID to retrieve orders for.
  - **orderId** (optional): Specific Order ID to retrieve a particular order. If omitted, retrieves all orders for the user.

- **Responses**:
  - **200 OK**:
    **For a specific order:**
    ```json
    {
      "order": {
        "orderId": "c8db9d25-5a61-4f79-9b54-4544e7f46982",
        "userId": "d1c5b5e7-ab95-4f48-b8de-c89de4eea640",
        "status_name": "Pending",
        "total": "349.97",
        "orderDate": "2024-08-29T23:23:03.634Z",
        "trackingCode": null,
        "items": [
          {
            "productId": "e85745de-032c-43e8-90dd-79c9d6489fb1",
            "quantity": 1,
            "price": "99.99"
          },
          {
            "productId": "e7f9cab3-a7a0-400b-adcc-489f6e1faa6c",
            "quantity": 1,
            "price": "49.99"
          },
          {
            "productId": "870d3b1b-a6d3-4255-893c-af31839c0ca7",
            "quantity": 1,
            "price": "119.99"
          }
        ]
      }
    }
    ```
    **For all orders:**
    ```json
    {
      "orders": [
        {
          "orderId": "c8db9d25-5a61-4f79-9b54-4544e7f46982",
          "userId": "d1c5b5e7-ab95-4f48-b8de-c89de4eea640",
          "status_name": "Pending",
          "total": "349.97",
          "orderDate": "2024-08-29T23:23:03.634Z",
          "trackingCode": null,
          "items": [
            {
              "productId": "e85745de-032c-43e8-90dd-79c9d6489fb1",
              "quantity": 1,
              "price": "99.99"
            },
            {
              "productId": "e7f9cab3-a7a0-400b-adcc-489f6e1faa6c",
              "quantity": 1,
              "price": "49.99"
            },
            {
              "productId": "870d3b1b-a6d3-4255-893c-af31839c0ca7",
              "quantity": 1,
              "price": "119.99"
            }
          ]
        }
      ]
    }
    ```

  - **401 Unauthorized**: If the token is invalid or missing.
  - **403 Forbidden**: If the user does not have permission to access the requested data.
  - **404 Not Found**: If the order or user does not exist.

- **Controller Method Overview**:
  - **Input**: Receives `userId` and `orderId` as parameters in the request body and the token from the headers.
  - **Business Logic**:
    - Validates the token and checks for required permissions.
    - If `orderId` is provided, retrieves the specific order and its items.
    - If `orderId` is not provided, retrieves all orders for the specified `userId`.
  - **Output**: Returns order details or a list of orders with associated items.

### **3. Get All Orders**

- **Endpoint**: `orders/getAllOrders`
- **Method**: `GET`
- **Description**: Retrieves all orders for the user. If `userId` is provided, retrieves orders for that specific user; otherwise, retrieves all orders from the database.

- **Request Headers**:
  - `Authorization`: Bearer token (Admin token required)
- **Request Body** (opcional):
  ```json
  {
    "userId": "e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04"
  }
  ```
  - **userId** (optional): If provided, retrieves orders for the specified user. If omitted, retrieves all orders.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "orders": [
        {
          "orderId": "2dd5701a-3b98-41b7-b9a0-bb09c03feb03",
          "userId": "e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04",
          "status_id": 1,
          "status_name": "Pending",
          "total": "349.97",
          "orderDate": "2024-08-29T23:11:31.182Z",
          "items": [
            {
              "productId": "e85745de-032c-43e8-90dd-79c9d6489fb1",
              "quantity": 1,
              "price": "99.99"
            },
            {
              "productId": "e7f9cab3-a7a0-400b-adcc-489f6e1faa6c",
              "quantity": 1,
              "price": "49.99"
            },
            {
              "productId": "870d3b1b-a6d3-4255-893c-af31839c0ca7",
              "quantity": 1,
              "price": "119.99"
            }
          ]
        }
      ]
    }
    ```
  - **401 Unauthorized**: If the token is invalid or missing.
  - **403 Forbidden**: If the user does not have administrative privileges.
  - **404 Not Found**: If no orders are found based on the `userId` provided.

- **Controller Method Overview**:
  - **Input**: Receives `userId` as a parameter in the request body and the token from the headers.
  - **Business Logic**:
    - Checks the token for administrative privileges.
    - Retrieves orders based on `userId` if provided, otherwise fetches all orders.
    - Aggregates order details and items from the database.
  - **Output**: Returns a list of orders with their associated items.

#### **4. Get All Statuses**

- **URL:** `orders/getAllStatus`
- **Method:** `GET`
- **Description:** Retrieves all possible statuses for orders.
- **Request Headers:**
  - `Authorization`: No needed
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

### **5. Update Order**

- **URL:** `orders/updateOrder/:id`
- **Method:** `PATCH`
- **Description:** Updates an existing order with new details.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Parameters:**
  - `id`: Order ID (path parameter)
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
- **Responses:**

  - **200 OK**:

    ```json
    {
      "message": "Order updated successfully",
      "order": {
        "orderId": "string",
        "userId": "string",
        "orderDate": "string",
        "status": "string",
        "total": "number",
        "trackingCode": "string",
        "items": [
          {
            "productId": "string",
            "quantity": "number",
            "price": "number"
          }
        ]
      }
    }
    ```

  - **400 Bad Request**: If the request body is invalid or missing required fields.
  - **401 Unauthorized**: If the token is invalid, missing, or the user is not an administrator.
  - **403 Forbidden**: If the user does not have permission to update the order.
  - **404 Not Found**: If the order or any specified products are not found.

- **Controller Method Overview**:
  - **Input**: Receives `orderId`, `statusId`, `items`, and `total` from the request body, and the token from the headers.
  - **Business Logic**:
    - Validates the token and checks for required permissions.
    - Updates the order with the new details.
    - If `items` are provided, deletes existing items and inserts new ones.
  - **Output**: Returns a success message and details of the updated order.

### **6. Cancel Order**

- **URL:** `orders/cancelOrder/:id`
- **Method:** `PATCH`
- **Description:** Cancels an existing order if its status is `1` (Pending) and if the request user is the owner of the order. Orders with other statuses cannot be canceled. Additionally, orders that have already been canceled (status `5`) cannot be canceled again.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Body:**
  - `userId`: User ID of the requester
- **Request Parameters:**
  - `id`: Order ID (path parameter)
- **Responses:**

  - **200 OK**:
    ```json
    {
      "message": "Order canceled successfully"
    }
    ```
  - **400 Bad Request**: If the request parameters or body are invalid.
  - **401 Unauthorized**: If the token is invalid, missing, or the user is not authorized. This also applies if the user does not have permission to cancel the order.
  - **403 Forbidden**: If the user does not have permission to cancel the order.
  - **404 Not Found**: If the order with the specified ID does not exist.
  - **409 Conflict**: If the order status is not `Pending` and cannot be canceled or if the order has already been canceled.

- **Controller Method Overview**:
  - **Input**: Receives `orderId` as a parameter in the request URL and `userId` in the request body. The `Authorization` token is provided in the request headers.
  - **Business Logic**:
    - Validates the token and checks for required permissions.
    - Checks if the order exists and whether its status is `Pending`.
    - Ensures that the user requesting the cancellation is the owner of the order.
    - Verifies that the order has not already been canceled.
    - If all conditions are met, cancels the order.
  - **Output**: Returns a success message indicating that the order was canceled.

### **7. Delete Order**

- **URL:** `orders/deleteOrder/:id`
- **Method:** `DELETE`
- **Description:** Deletes an existing order and its associated items. This operation is only accessible to users with admin privileges. It first removes all items associated with the order and then deletes the order itself.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Parameters:**
  - `id`: Order ID (path parameter)
- **Responses:**

  - **200 OK**:
    ```json
    {
      "message": "Order deleted successfully"
    }
    ```
  - **400 Bad Request**: If the request parameters are invalid.
  - **401 Unauthorized**: If the token is invalid or missing.
  - **403 Forbidden**: If the user does not have admin privileges.
  - **404 Not Found**: If the order with the specified ID does not exist.
  - **409 Conflict**: If there is an issue with deleting the order, possibly due to constraints or dependencies.

- **Controller Method Overview**:
  - **Input**: Receives `orderId` as a parameter in the request URL. The `Authorization` token is provided in the request headers.
  - **Business Logic**:
    - Validates the token and checks for admin privileges.
    - Checks if the order exists.
    - Deletes all items associated with the order.
    - Deletes the order itself.
  - **Output**: Returns a success message indicating that the order was deleted.

### Wish List Endpoints

### **1. Create Wishlist**

- **URL:** `wishlist/createWishList`
- **Method:** `POST`
- **Description:** Creates a new wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Body:**
  ```json
  {
    "userId": "string",
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
- **Error Handling:**
  - **401 Unauthorized:** Invalid or missing token.
  - **404 Not Found:** Product not found or inactive.

### **2. Get Wishlist**

- **URL:** `wishlist/getWishList/:id`
- **Method:** `GET`
- **Description:** Retrieves the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Parameters:**
  - `id`: user ID (path parameter)
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
- **Error Handling:**
  - **401 Unauthorized:** Invalid or missing token.
  - **404 Not Found:** Wishlist not found for the authenticated user.

### **3. Update Wishlist**

- **URL:** `wishlist/updateWishList/:id`
- **Method:** `PATCH`
- **Description:** Updates the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Parameters:**
  - `id`: user ID (path parameter)
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
- **Error Handling:**
  - **401 Unauthorized:** Invalid or missing token.
  - **404 Not Found:** Wishlist not found for the authenticated user.
  - **404 Not Found:** Product not found or inactive.

### **4 Delete Wishlist**

- **URL:** `wishlist/deleteWishList/:id`
- **Method:** `DELETE`
- **Description:** Deletes the wishlist for the authenticated user.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Parameters:**
  - `id`: user ID (path parameter)
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Wishlist deleted successfully"
    }
    ```
- **Error Handling:**
  - **401 Unauthorized:** Invalid or missing token.
  - **404 Not Found:** Wishlist not found for the authenticated user.

### Tickets Endpoints

### **1. Create Ticket**

- **URL:** `tickets/createTicket`
- **Method:** `POST`
- **Description:** Creates a new ticket with the specified details.
- **Request Headers:**
  - `Authorization`: No needed
- **Request Body:**
  ```json
  {
    "userId": "string",
    "typeId": "string",
    "description": "string",
    "userName": "string",
    "userEmail": "string",
    "userPhoneNumber": "string"
  }
  ```
- **Responses:**
  - **201 Created**:
    ```json
    {
      "message": "Ticket created successfully",
      "ticket": {
        "id": "string",
        "user_id": "string",
        "type_id": "string",
        "description": "string",
        "status_id": "string",
        "user_name": "string",
        "user_email": "string",
        "user_phone_number": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid.
  - **409 Conflict**: If the ticket already exists.

### **2. Get Ticket By Id**

- **URL:** `tickets/getTicketById/:id`
- **Method:** `GET`
- **Description:** Retrieves the details of a specific ticket by ticketID.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Parameters:**
  - `id`: Ticket ID (path parameter)
- **Responses:**
  - **200 OK**:
    ```json
    {
      "ticketId": "string",
      "userId": "string",
      "typeId": "string",
      "statusId": "string",
      "description": "string",
      "solution": "string",
      "analistName": "string",
      "analistEmail": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **404 Not Found**: If the ticket is not found.

### **3. Get Tickets By User Id**

- **URL:** `tickets/getTicketsByUserId/:id`
- **Method:** `GET`
- **Description:** Retrieves the details of all tickets from a user.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Parameters:**
  - `id`: User ID (path parameter)
- **Responses:**

  - **200 OK**:

    ```json
    {
      "tickets": [
        {
          "ticketId": "string",
          "userId": "string",
          "typeId": "string",
          "statusId": "string",
          "description": "string",
          "solution": "string",
          "analistName": "string",
          "analistEmail": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "total": "number"
    }
    ```

  - **404 Not Found**: If the ticket is not found.

### **4. Get All Tickets**

- **URL:** `tickets/getAllTickets`
- **Method:** `POST`
- **Description:** Retrieves a list of tickets based on specified optional filters.
- **Request Headers:**
  - `Authorization`: Bearer token
- **Request Body:**
  ```json
  {
    "id": "string",
    "userId": "string",
    "typeId": "string",
    "statusId": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
    ```json
    {
      "tickets": [
        {
          "ticketId": "string",
          "userId": "string",
          "typeId": "string",
          "typeName": "string",
          "statusId": "string",
          "statusName": "string",
          "description": "string",
          "name": "string",
          "email": "string",
          "solution": "string",
          "analistName": "string",
          "analistEmail": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "total": "number"
    }
    ```

### **5. Update Ticket**

- **URL:** `tickets/updateTicket`
- **Method:** `PUT`
- **Description:** Updates an existing ticket.
- **Request Headers:**
  - `Authorization`: Bearer token (Admin token required)
- **Request Body:**
  ```json
  {
    "ticketId": "string",
    "typeId": "string",
    "solution": "string",
    "statusId": "string",
    "analistName": "string",
    "analistEmail": "string"
  }
  ```
- **Responses:**
  - **200 OK**:
    ```json
    {
      "message": "Ticket updated successfully",
      "ticket": {
        "id": "string",
        "user_id": "string",
        "type_id": "string",
        "description": "string",
        "status_id": "string",
        "solution": "string",
        "analist_name": "string",
        "analist_email": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```
  - **400 Bad Request**: If the request body is invalid or missing required fields.
  - **404 Not Found**: If the ticket is not found.

### **6. Get All Statuses**

- **URL:** `tickets/getAllStatus`
- **Method:** `GET`
- **Description:** Retrieves a list of all ticket statuses.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string"
      }
    ]
    ```

### **7. Get All Types**

- **URL:** `tickets/getAllTypes`
- **Method:** `GET`
- **Description:** Retrieves a list of all ticket types.
- **Request Headers:**
  - `Authorization`: No needed
- **Responses:**
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string"
      }
    ]
    ```

### Error Handling

Effective error handling is crucial for debugging and user experience. The Clothing Store API employs a structured approach to error handling.

The `ErrorHandler` class centralizes error management and sends appropriate HTTP responses based on the error type.

#### Error Types

- **ZodError**: Occurs when data validation fails. Returns a `400 Bad Request` status with details of the validation errors.
- **BadRequestError**: Indicates invalid requests. Returns a `400 Bad Request` status.
- **ConflictError**: Used for conflicting requests. Returns a `409 Conflict` status.
- **ForbiddenError**: Denotes access denial. Returns a `403 Forbidden` status.
- **NotFoundError**: Represents resources that could not be found. Returns a `404 Not Found` status.
- **UnauthorizedError**: Indicates authentication issues. Returns a `401 Unauthorized` status.

#### Error Response Format

- **Validation Errors**: `{ errors: [ { path, message } ] }`
- **General Errors**: `{ message: "error message" }`

#### Example

**Request Fails Validation**

```json
// Response Body
{
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Required"
    }
  ]
}
```

**Request Causes Not Found Error**

```json
// Response Body
{
  "message": "Resource not found"
}
```

This approach ensures that errors are communicated clearly, making it easier for clients to handle them appropriately.

### Logging

Effective logging is essential for monitoring, debugging, and maintaining your application. The Clothing Store API uses Winston for structured and configurable logging.

#### Logging Overview

Winston is configured to capture logs at various levels and formats, allowing for detailed and accessible logging information.

#### Logger Configuration

- **Log Levels**:

  - `error`: For error messages and critical issues.
  - `info`: For general informational messages.

- **Formats**:

  - **JSON Format**: Logs include timestamps and are structured as JSON objects, ideal for centralized logging systems.
  - **Simple Format**: In non-production environments, logs are displayed in a human-readable format on the console.

- **Transports**:
  - **File Transports**:
    - `error.log`: Logs critical issues and errors.
    - `combined.log`: Logs all messages, including both informational and error messages.
  - **Console Transport**:
    - Used only in non-production environments for easy debugging.

#### Example Log Entries

**Error Log Entry (error.log)**

```json
{
  "level": "error",
  "message": "Error occurred while processing request",
  "timestamp": "2024-08-29T12:00:00.000Z"
}
```

**Informational Log Entry (combined.log)**

```json
{
  "level": "info",
  "message": "User successfully created",
  "timestamp": "2024-08-29T12:00:00.000Z"
}
```

#### Log Path

Logs are stored in the `files` directory within the project's root:

- `error.log`
- `combined.log`

#### Benefits

- **Improved Debugging**: Structured logging helps quickly identify issues and their context.
- **Monitoring**: Track application behavior and performance over time.
- **Audit Trails**: Maintain records of significant events and errors for compliance and analysis.

By leveraging Winston, the API ensures robust logging practices, enhancing both development and operational efficiency.

## Testing

We use Jest for unit testing to ensure code quality and reliability. The tests cover both the business logic and the controller layers of the project, validating that each component works as expected and handles errors properly.

With Jest, you get:

- **Comprehensive Coverage**: All key functionalities and edge cases are tested.
- **Fast Feedback**: Tests run quickly, allowing you to catch issues early.
- **Easy Debugging**: Detailed error messages help pinpoint problems.

Running the tests is straightforward. Simply use `npm test` to execute all unit tests and verify that everything is working correctly.
