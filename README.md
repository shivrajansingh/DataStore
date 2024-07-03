
# Project Name: DataStore

#### Description:
DataStore is a lightweight database system built with Express.js and SQLite, designed to store and manage data efficiently. It provides RESTful APIs for CRUD operations, table management, and SQL execution.

### Routes

#### Homepage
- **Description:** Displays a welcome message.
- **Route:** `GET /`
- **Usage:** Accessing the root URL of the application.

#### List All Tables
- **Description:** Retrieves a list of all tables in the database.
- **Route:** `GET /tables`
- **Usage:** Lists all existing tables in the SQLite database.

#### Get All Keys of a Table
- **Description:** Retrieves all keys stored in a specified table.
- **Route:** `GET /:table/keys`
- **Usage:** Retrieves all keys stored in the specified `:table`.

#### Get Count of Rows in a Table
- **Description:** Retrieves the count of rows in a specified table, optionally filtered by conditions.
- **Route:** `GET /:table/count`
- **Usage:** Counts the rows in the specified `:table`, optionally filtered by query parameters.

#### Get Table Data
- **Description:** Retrieves data from a specified table, optionally filtered by conditions.
- **Route:** `GET /:table`
- **Usage:** Retrieves data from the specified `:table`, optionally filtered by query parameters.

#### Get Table Data with Pagination
- **Description:** Retrieves paginated data from a specified table, optionally filtered by conditions.
- **Route:** `GET /:table/page/:page`
- **Usage:** Retrieves paginated data from the specified `:table`, with each page containing up to 10 records.

#### Insert or Update Data
- **Description:** Inserts new data into the specified table or updates existing data if the key already exists.
- **Route:** `POST /:table`
- **Usage:** Inserts or updates data in the specified `:table` based on the provided key-value pair.

#### Retrieve Data by Key
- **Description:** Retrieves data from a specified table based on the provided key.
- **Route:** `GET /:table/:key`
- **Usage:** Retrieves data from the specified `:table` based on the provided `:key`.

#### Delete a Table
- **Description:** Deletes a specified table from the database.
- **Route:** `DELETE /:table`
- **Usage:** Deletes the specified `:table` and all its associated data.

#### Delete Data by Key
- **Description:** Deletes data from a specified table based on the provided key.
- **Route:** `DELETE /:table/:key`
- **Usage:** Deletes data from the specified `:table` based on the provided `:key`.

#### Update Data by Key
- **Description:** Updates data in a specified table based on the provided key.
- **Route:** `PUT /:table/:key`
- **Usage:** Updates data in the specified `:table` based on the provided `:key`.

#### Execute SQL Statement
- **Description:** Executes a custom SQL statement against the SQLite database.
- **Route:** `POST /sql`
- **Usage:** Executes the provided SQL statement and returns the result.

### Example Usage
- **Insert Data:**
  ```bash
  POST /users
  Body: { "key": "example_key", "value": "example_value" }
  ```
- **Retrieve Data:**
  ```bash
  GET /users/example_key
  ```
- **Delete Table:**
  ```bash
  DELETE /users
  ```

#### List All Tables
- **Retrieve All Tables:**
  ```bash
  GET /tables
  ```

#### Get All Keys of a Table
- **Retrieve All Keys from `users` Table:**
  ```bash
  GET /users/keys
  ```

#### Get Count of Rows in a Table
- **Count Rows in `users` Table:**
  ```bash
  GET /users/count
  ```
  **Count Rows in `users` Table with Condition:**
  ```bash
  GET /users/count?condition=value
  ```

#### Get Table Data
- **Retrieve All Data from `users` Table:**
  ```bash
  GET /users
  ```
  **Retrieve Data from `users` Table with Condition:**
  ```bash
  GET /users?condition=value
  ```

#### Get Table Data with Pagination
- **Retrieve Page 1 of Data from `users` Table:**
  ```bash
  GET /users/page/1
  ```

#### Insert or Update Data
- **Insert or Update Data in `users` Table:**
  ```bash
  POST /users
  Body: { "key": "example_key", "value": "updated_value" }
  ```

#### Retrieve Data by Key
- **Retrieve Data with Key `example_key` from `users` Table:**
  ```bash
  GET /users/example_key
  ```

#### Delete a Table
- **Delete `users` Table:**
  ```bash
  DELETE /users
  ```

#### Delete Data by Key
- **Delete Data with Key `example_key` from `users` Table:**
  ```bash
  DELETE /users/example_key
  ```

#### Update Data by Key
- **Update Data with Key `example_key` in `users` Table:**
  ```bash
  PUT /users/example_key
  Body: { "value": "updated_value" }
  ```

#### Execute SQL Statement
- **Execute Custom SQL Statement:**
  ```bash
  POST /sql
  Body: { "sql": "SELECT * FROM users WHERE key = 'example_key'" }
  ```

### Example Response
- **Successful Response:**
  ```json
  {
    "id": 1,
    "key": "example_key",
    "value": "updated_value"
  }
  ```

- **Error Response:**
  ```json
  {
    "error": "Key not found"
  }
  ```
