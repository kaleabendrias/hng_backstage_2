# User Authentication and Organization Management API

This project is a Node.js application that provides endpoints for user authentication, organization management, and user access control using PostgreSQL for data storage, Sequelize ORM for database interactions, and JWT for authentication.

## Features

- **User Authentication**:
  - Register new users with unique email and userId.
  - Hash passwords before storing them securely.
  - Validate and sanitize user input to prevent common security vulnerabilities.

- **User Login**:
  - Authenticate users with email and password.
  - Issue JWT tokens for secure API access.

- **Organization Management**:
  - Create organizations automatically upon user registration.
  - Users can belong to multiple organizations.
  - Manage organizations with basic CRUD operations.

- **Access Control**:
  - Secure endpoints using JWT authentication.
  - Users can access only their own data and organizations they belong to or created.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kaleabendrias/hng_backstage_2.git
   cd hng_backstage_2/back
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database:**

   - Create a PostgreSQL database.

4. **Run database migrations:**

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST /auth/register**
  - Registers a new user and creates a default organization.
  - Request Body:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string",
      "phone": "string"
    }
    ```
  - Successful Response (201):
    ```json
    {
      "status": "success",
      "message": "Registration successful",
      "data": {
        "accessToken": "eyJh...",
        "user": {
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phone": "string"
        }
      }
    }
    ```

- **POST /auth/login**
  - Logs in a user and returns a JWT token.
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Successful Response (200):
    ```json
    {
      "status": "success",
      "message": "Login successful",
      "data": {
        "accessToken": "eyJh...",
        "user": {
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phone": "string"
        }
      }
    }
    ```

### User Management

- **GET /api/users/:id**
  - Retrieves user details.
  - Protected Route (Requires JWT Token).

- **GET /api/organisations**
  - Retrieves all organizations for the logged-in user.
  - Protected Route (Requires JWT Token).

- **GET /api/organisations/:orgId**
  - Retrieves details of a specific organization.
  - Protected Route (Requires JWT Token).

- **POST /api/organisations**
  - Creates a new organization.
  - Request Body:
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
  - Successful Response (201):
    ```json
    {
      "status": "success",
      "message": "Organisation created successfully",
      "data": {
        "orgId": "string",
        "name": "string",
        "description": "string"
      }
    }
    ```

- **POST /api/organisations/:orgId/users**
  - Adds a user to a specific organization.
  - Request Body:
    ```json
    {
      "userId": "string"
    }
    ```
  - Successful Response (200):
    ```json
    {
      "status": "success",
      "message": "User added to organisation successfully"
    }
    ```

## Error Handling

- Validation errors are returned with status code 422 and detailed error messages in the response body.
- Authentication and authorization errors are returned with status code 401 or 403 as appropriate.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (JSON Web Tokens)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
