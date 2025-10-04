# Electro Grand Server - API Guide for Frontend Development

This document provides a comprehensive guide for frontend developers and AI agents to understand and integrate with the Electro Grand e-commerce server API.

## 🌐 Base Configuration

- **Server URL**: `http://localhost:4200/backend` (development)
- **Authentication**: JWT Bearer tokens
- **Content Type**: `application/json`
- **CORS**: Enabled for frontend origins

## 🔐 Authentication Flow

### 1. User Registration

```http
POST /backend/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "userRole": "CUSTOMER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login

```http
POST /backend/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Admin Authentication

```http
POST /backend/auth/login-admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpass123",
  "secretKey": "admin-secret-key"
}
```

### 4. Token Refresh

```http
POST /backend/auth/access-token
```

_Note: Refresh token is automatically sent via cookies_

### 5. Using JWT Tokens

Include the access token in all authenticated requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Core Data Models

### User

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  userRole: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  createdAt: string;
  updatedAt: string;
}
```

### Product

```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents
  images: string[];
  categoryId: number;
  subcategoryId: number;
  brandId: number;
  category: Category;
  subcategory: Subcategory;
  brand: Brand;
  productAttribute: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}
```

### Category

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}
```

### Order

```typescript
interface Order {
  id: number;
  status: 'NEW' | 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE';
  customerEmail: string;
  customerPhone: string;
  deliveryType: 'NOVA_POST' | 'UKR_POST';
  deliveryAddress: string;
  comments: string;
  userId?: number;
  orderItems: OrderItem[];
  payment: Payment[];
  createdAt: string;
  updatedAt: string;
}
```

### OrderItem

```typescript
interface OrderItem {
  id: number;
  quantity: number;
  price: number; // Price in cents
  orderId: number;
  productId: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}
```

## 🛍️ E-commerce API Endpoints

### Products

#### Get All Products

```http
GET /backend/product?searchTerm=iphone&sort=price-asc&minPrice=10000&maxPrice=200000
```

**Query Parameters:**

- `searchTerm`: Search in product names
- `sort`: `newest`, `oldest`, `price-asc`, `price-desc`
- `minPrice`: Minimum price in cents
- `maxPrice`: Maximum price in cents

#### Get Product by ID

```http
GET /backend/product/by-id/1
```

#### Get Product by Slug

```http
GET /backend/product/by-slug/iphone-15-pro
```

#### Get Products by Category

```http
GET /backend/product/by-category/electronics
```

#### Get Products by Brand

```http
GET /backend/product/by-brand/apple
```

#### Create Product (Admin Only)

```http
POST /backend/product
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 99999,
  "categoryId": 1,
  "subcategoryId": 1,
  "brandId": 1
}
```

#### Upload Product Images (Admin Only)

```http
PUT /backend/product/set-images/1
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

files: [File, File, ...]
```

### Categories

#### Get All Categories

```http
GET /backend/category
```

#### Get Category by Slug

```http
GET /backend/category/by-slug/electronics
```

#### Create Category (Admin Only)

```http
POST /backend/category
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Electronics"
}
```

### Orders

#### Create Order

```http
POST /backend/order
Content-Type: application/json

{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99999
    }
  ],
  "customerEmail": "customer@example.com",
  "customerPhone": "+1234567890",
  "deliveryType": "NOVA_POST",
  "deliveryAddress": "123 Main St, City, Country",
  "comments": "Please call before delivery",
  "userId": 1
}
```

#### Get User Orders (Authenticated)

```http
GET /backend/order/by-user-orders
Authorization: Bearer <user-token>
```

#### Get All Orders (Admin Only)

```http
GET /backend/order
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin Only)

```http
PUT /backend/order/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

### Reviews

#### Get Product Reviews

```http
GET /backend/review/by-product/1
```

#### Create Review (Authenticated)

```http
POST /backend/review
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "rating": 5,
  "text": "Great product, highly recommended!",
  "productId": 1
}
```

### User Management

#### Get Current User Profile

```http
GET /backend/user/by-id
Authorization: Bearer <user-token>
```

#### Update User Profile

```http
PUT /backend/user/update
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

#### Get All Users (Admin Only)

```http
GET /backend/user/get-all
Authorization: Bearer <admin-token>
```

## 🔄 Common Frontend Integration Patterns

### 1. Authentication State Management

```typescript
// Store JWT token
localStorage.setItem('accessToken', response.accessToken);

// Include in requests
const token = localStorage.getItem('accessToken');
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Handle token refresh
if (response.status === 401) {
  // Attempt token refresh
  const refreshResponse = await fetch('/backend/auth/access-token', {
    method: 'POST',
    credentials: 'include' // Include cookies
  });
}
```

### 2. Product Catalog Display

```typescript
// Fetch products with filters
const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/backend/product?${params}`);
  return response.json();
};

// Example usage
const products = await fetchProducts({
  searchTerm: 'iphone',
  sort: 'price-asc',
  minPrice: '50000',
  maxPrice: '150000',
});
```

### 3. Shopping Cart to Order Conversion

```typescript
// Convert cart items to order format
const createOrderFromCart = (cartItems, customerInfo) => {
  return {
    orderItems: cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    deliveryType: customerInfo.deliveryType,
    deliveryAddress: customerInfo.address,
    comments: customerInfo.comments || '',
    userId: currentUser?.id,
  };
};
```

### 4. File Upload Handling

```typescript
// Upload product images
const uploadProductImages = async (productId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`/backend/product/set-images/${productId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

## 🛡️ Error Handling

### Common Error Responses

#### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
```

#### Unauthorized (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### Forbidden (403)

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

#### Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

### Frontend Error Handling Pattern

```typescript
const handleApiError = (error) => {
  switch (error.status) {
    case 400:
      // Show validation errors
      return error.message.join(', ');
    case 401:
      // Redirect to login or refresh token
      redirectToLogin();
      break;
    case 403:
      // Show access denied message
      showAccessDeniedMessage();
      break;
    case 404:
      // Show not found message
      showNotFoundMessage();
      break;
    default:
      // Show generic error
      showGenericError();
  }
};
```

## 🔄 Real-time Features

### WebSocket Events (if implemented)

- Order status updates
- New review notifications
- Product inventory changes

## 🎯 Frontend Implementation Checklist

### Authentication

- [ ] Login/Register forms
- [ ] JWT token storage and management
- [ ] Token refresh mechanism
- [ ] Protected route handling
- [ ] Admin role verification

### Product Catalog

- [ ] Product listing with filters
- [ ] Product detail pages
- [ ] Category navigation
- [ ] Search functionality
- [ ] Image galleries

### Shopping Cart

- [ ] Add/remove items
- [ ] Quantity management
- [ ] Price calculations
- [ ] Local storage persistence

### Checkout Process

- [ ] Customer information form
- [ ] Order summary
- [ ] Delivery options
- [ ] Order confirmation

### User Account

- [ ] Profile management
- [ ] Order history
- [ ] Favorite products
- [ ] Review management

### Admin Panel (if applicable)

- [ ] Product management
- [ ] Order management
- [ ] User management
- [ ] Category management
- [ ] File upload interface

## 💡 Performance Optimization Tips

1. **Pagination**: Use limit/offset parameters for large datasets
2. **Image Optimization**: Implement lazy loading for product images
3. **Caching**: Cache frequently accessed data (categories, brands)
4. **Debouncing**: Implement search debouncing for better UX
5. **Error Boundaries**: Implement React error boundaries for better error handling

## 🧪 Testing API Endpoints

### Using cURL Examples

```bash
# Register user
curl -X POST http://localhost:4200/backend/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Get products
curl -X GET http://localhost:4200/backend/product

# Create order
curl -X POST http://localhost:4200/backend/order \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [{"productId": 1, "quantity": 1, "price": 99999}],
    "customerEmail": "test@example.com",
    "customerPhone": "+1234567890",
    "deliveryType": "NOVA_POST",
    "deliveryAddress": "123 Test St"
  }'
```

## 📱 Mobile Considerations

- All endpoints support mobile applications
- Use proper HTTP status codes for mobile error handling
- Implement proper pagination for mobile performance
- Consider implementing push notifications for order updates

This guide provides everything needed to successfully integrate with the Electro Grand e-commerce API. The server follows RESTful conventions and provides comprehensive error handling to ensure smooth frontend integration.
