# Grocery Store Management API

A comprehensive backend REST API for managing a grocery store, built with Express.js, TypeORM, and TypeScript. This API provides functionality for inventory management, order processing, and user authentication.

## Features

- **User Authentication**

  - Registration and login with JWT authentication
  - Role-based access control (user/admin)

- **Admin Features**

  - Manage grocery items (CRUD operations)
  - Inventory management
  - Stock threshold notifications

- **User Features**
  - Browse available grocery items
  - Place orders
  - View order history

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Language**: TypeScript

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Admin Routes (Requires admin role)

    username : admin
    password : admin123

- `POST /api/admin/groceries` - Add a new grocery item
- `GET /api/admin/groceries` - Get all grocery items with inventory
- `PUT /api/admin/groceries/:id` - Update a grocery item
- `DELETE /api/admin/groceries/:id` - Delete a grocery item
- `PUT /api/admin/inventory/:id` - Update inventory for a grocery item

### User Routes (Requires authentication)

    username : Vibhav
    password : hello

- `GET /api/user/groceries` - Get available grocery items
- `POST /api/user/orders` - Create a new order
- `GET /api/user/orders` - Get order history for the authenticated user

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vibhav005/qp-assessment
   cd qp-assessment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following content:

   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=grocery_store
   ```

4. Set up the database:

   ```bash
   npm run typeorm:migration:run
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## Database Schema

### User

- id: number (PK)
- username: string (unique)
- email: string (unique)
- password: string (hashed)
- role: string (user/admin)
- createdAt: date

### Grocery

- id: number (PK)
- name: string
- description: string
- price: number
- category: string
- imageUrl: string
- createdAt: date
- updatedAt: date

### Inventory

- id: number (PK)
- groceryId: number (FK)
- quantity: number
- threshold: number
- lastRestockDate: date

### Order

- id: number (PK)
- userId: number (FK)
- status: string
- totalAmount: number
- address: string
- phone: string
- createdAt: date

### OrderItem

- id: number (PK)
- orderId: number (FK)
- groceryId: number (FK)
- quantity: number
- unitPrice: number

## Testing

The repository includes an HTML-based API testing interface. This was just fun way of me to make things simple to use and for you to testing the apis. To use it:

1. Start the server
2. Open the `index.html` file in your browser from public folder
3. Use the interface to test all API endpoints

## Type Definitions

The API uses TypeScript interfaces for type safety. Key types include:

```typescript
// Auth requests
interface AuthRegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthLoginRequest {
  username: string;
  password: string;
}

// Grocery and inventory
interface GroceryItemRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  quantity?: number;
  threshold?: number;
}

interface InventoryUpdateRequest {
  quantity?: number;
  threshold?: number;
}

// Orders
interface OrderRequest {
  items: Array<{
    groceryId: number;
    quantity: number;
  }>;
  address: string;
  phone: string;
}
```

## Middleware

The API includes authentication middleware:

- `authenticate`: Verifies JWT token and attaches user info to request
- `isAdmin`: Ensures the user has admin privileges

## Error Handling

The API implements consistent error handling:

- HTTP 400: Bad request (validation errors)
- HTTP 401: Unauthorized (authentication issues)
- HTTP 403: Forbidden (permission issues)
- HTTP 404: Not found
- HTTP 500: Server error

## Some more details

- I have used `MySql` in my company so I wanted to try a new database that's why I used `PostgreSql` here.
- Hope to see you giving a start to this repo.
- `Happy Coding !`
- `Happy Coding !`
- `Happy Coding !`
- `Happy Coding !`
