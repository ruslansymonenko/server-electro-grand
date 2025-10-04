# Electro Grand Server - Technical Documentation

## Project Overview

Electro Grand Server is a comprehensive e-commerce backend API built with NestJS and TypeScript. The system provides a complete solution for managing an online electronics store, including user authentication, product catalog management, order processing, payments, and administrative features.

### Main Features

- **User Management**: Customer and admin registration/authentication with JWT tokens
- **Product Catalog**: Products with categories, subcategories, brands, and attributes
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Processing**: Payment status management and tracking
- **Review System**: Customer product reviews and ratings
- **File Management**: Product and category image uploads
- **Admin Panel**: Administrative endpoints for content management
- **Email Service**: Notification system for orders and updates

## Technologies Used

### Core Framework & Runtime

- **NestJS** (v10.0.0) - Progressive Node.js framework for building scalable server-side applications
- **Node.js** (v22.11.0) - JavaScript runtime environment
- **TypeScript** (v5.1.3) - Static type checking and enhanced developer experience

### Database & ORM

- **PostgreSQL** - Primary database for data persistence
- **Prisma** (v5.18.0) - Modern ORM for type-safe database access
- **Prisma Client** - Auto-generated database client

### Authentication & Security

- **@nestjs/jwt** (v10.2.0) - JWT token management
- **@nestjs/passport** (v10.0.3) - Authentication middleware
- **passport-jwt** (v4.0.1) - JWT authentication strategy
- **argon2** (v0.40.3) - Password hashing
- **cookie-parser** (v1.4.6) - Cookie handling

### Validation & Transformation

- **class-validator** (v0.14.1) - Decorator-based validation
- **class-transformer** (v0.5.1) - Object transformation and serialization

### File Handling & Utilities

- **multer** - File upload handling (via @nestjs/platform-express)
- **fs-extra** (v11.2.0) - Enhanced file system utilities
- **uuid** (v10.0.0) - Unique identifier generation
- **slugify** (v1.6.6) - URL-friendly string generation

### Email & Communications

- **nodemailer** (v6.9.16) - Email sending functionality

### Development & Testing

- **Jest** (v29.5.0) - Testing framework
- **ESLint** (v8.42.0) - Code linting
- **Prettier** (v3.0.0) - Code formatting
- **@faker-js/faker** (v9.0.3) - Test data generation

### HTTP & External Services

- **@nestjs/axios** (v3.0.2) - HTTP client for external API calls
- **rxjs** (v7.8.1) - Reactive programming library

## Setup and Run Instructions

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server-electro-grand
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/electro_grand"
   JWT_SECRET="your-jwt-secret-key"
   JWT_EXPIRES_IN="7d"
   ADMIN_SECRET_KEY="your-admin-secret-key"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-email@example.com"
   SMTP_PASSWORD="your-email-password"
   CLIENT_URL="http://localhost:3000"
   PORT=4200
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npm run seeder:all
   ```

5. **Development Server**

   ```bash
   # Start in development mode with hot reload
   npm run start:dev

   # Start in production mode
   npm run start:prod
   ```

### Docker Setup

1. **Build and run with Docker**

   ```bash
   docker build -t electro-grand-server .
   docker run -p 3001:3001 electro-grand-server
   ```

2. **Using Docker Compose** (recommended for development)
   Create a `docker-compose.yml` file:

   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - '3001:3001'
       environment:
         - DATABASE_URL=postgresql://postgres:password@db:5432/electro_grand
       depends_on:
         - db

     db:
       image: postgres:15
       environment:
         POSTGRES_DB: electro_grand
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - '5432:5432'

   volumes:
     postgres_data:
   ```

## Environment Variables and Configuration

### Required Environment Variables

| Variable           | Description                       | Example                                    |
| ------------------ | --------------------------------- | ------------------------------------------ |
| `DATABASE_URL`     | PostgreSQL connection string      | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`       | Secret key for JWT token signing  | `your-super-secret-jwt-key`                |
| `JWT_EXPIRES_IN`   | JWT token expiration time         | `7d`                                       |
| `ADMIN_SECRET_KEY` | Secret key for admin registration | `admin-secret-key`                         |
| `SMTP_HOST`        | SMTP server hostname              | `smtp.gmail.com`                           |
| `SMTP_PORT`        | SMTP server port                  | `587`                                      |
| `SMTP_USER`        | SMTP username/email               | `noreply@yourstore.com`                    |
| `SMTP_PASSWORD`    | SMTP password                     | `your-email-password`                      |
| `CLIENT_URL`       | Frontend application URL          | `http://localhost:3000`                    |
| `PORT`             | Server port number                | `4200`                                     |

### Optional Environment Variables

| Variable   | Description             | Default       |
| ---------- | ----------------------- | ------------- |
| `NODE_ENV` | Application environment | `development` |

## Folder Structure Explanation

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # Auth endpoints (login, register, tokens)
│   ├── auth.service.ts        # Auth business logic
│   ├── auth.module.ts         # Auth module configuration
│   ├── decorators/            # Custom auth decorators (@Auth, @CurrentUser)
│   ├── dto/                   # Auth data transfer objects
│   ├── guards/                # JWT and role-based guards
│   └── strategies/            # Passport strategies
├── user/                      # User management module
├── product/                   # Product management module
├── category/                  # Category management module
├── subcategory/               # Subcategory management module
├── brand/                     # Brand management module
├── attribute/                 # Product attributes module
├── attribute-value/           # Attribute values module
├── product-attribute/         # Product-attribute relations module
├── order/                     # Order management module
├── order-item/                # Order items module
├── payment/                   # Payment processing module
├── review/                    # Product reviews module
├── files/                     # File upload/management module
├── mailer/                    # Email service module
├── database/                  # Database configuration
│   ├── prisma.module.ts       # Prisma module
│   └── prisma.service.ts      # Prisma service
├── config/                    # Configuration files
├── consts/                    # Application constants
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
└── seeder/                    # Database seeding scripts

prisma/
├── schema.prisma              # Database schema definition
└── migrations/                # Database migration files

public/
└── assets/                    # Static files (images, etc.)
```

### Module Architecture

Each feature module follows NestJS conventions:

- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **Module**: Configures the module and its dependencies
- **DTO**: Data Transfer Objects for request/response validation
- **Types**: TypeScript interfaces and enums

### Key Architectural Patterns

1. **Dependency Injection**: NestJS built-in DI container
2. **Guard-based Authorization**: Role-based access control
3. **Decorator Pattern**: Custom decorators for auth and validation
4. **Repository Pattern**: Prisma ORM for data access
5. **Modular Architecture**: Feature-based module organization

## Database Schema Overview

### Core Entities

- **User**: Customer and admin accounts with role-based access
- **Product**: Product catalog with rich metadata
- **Category/Subcategory**: Hierarchical product organization
- **Brand**: Product manufacturers/brands
- **Attribute/AttributeValue**: Flexible product characteristics
- **Order/OrderItem**: Order management and line items
- **Payment**: Payment tracking and status
- **Review**: Customer product reviews
- **UserFavoriteProducts**: User wishlist functionality

### Key Relationships

- Products belong to categories, subcategories, and brands
- Products can have multiple attributes through ProductAttribute
- Orders contain multiple OrderItems
- Users can have multiple orders, payments, and reviews
- Many-to-many relationship for user favorite products

## API Architecture

### Authentication Strategy

- JWT-based authentication with refresh tokens
- Role-based authorization (CUSTOMER, ADMIN, MANAGER)
- Cookie-based refresh token storage
- Separate admin authentication flow

### Request/Response Pattern

- Consistent error handling across all endpoints
- Standardized response formats
- Comprehensive input validation using class-validator
- File upload support for images

### Security Features

- Password hashing with Argon2
- CORS configuration for cross-origin requests
- JWT token expiration and refresh mechanism
- Admin-only endpoints protection

## Code Quality Assessment

### Strengths

✅ **Well-structured modular architecture**
✅ **Comprehensive validation using class-validator**
✅ **Type safety with TypeScript and Prisma**
✅ **Proper authentication and authorization**
✅ **Clean separation of concerns**
✅ **Docker support for deployment**

### Areas for Improvement

❌ **Missing Swagger/OpenAPI documentation**
❌ **No global error handling filters**
❌ **Limited logging implementation**
❌ **No rate limiting**
❌ **Missing comprehensive testing**
❌ **No request/response interceptors for logging**
❌ **No health check endpoints**
❌ **Missing API versioning strategy**

### Recommended Improvements

1. **Add Swagger Documentation**

   - Install @nestjs/swagger
   - Add API decorators to controllers
   - Generate comprehensive API documentation

2. **Implement Global Exception Filter**

   - Create custom exception filters
   - Standardize error responses
   - Add proper error logging

3. **Add Logging Service**

   - Implement Winston or NestJS logger
   - Add request/response logging
   - Include error tracking

4. **Security Enhancements**

   - Add rate limiting with @nestjs/throttler
   - Implement request sanitization
   - Add helmet for security headers

5. **Testing Infrastructure**

   - Unit tests for services
   - Integration tests for controllers
   - E2E tests for critical workflows

6. **Performance Monitoring**

   - Add health check endpoints
   - Implement metrics collection
   - Database query optimization

7. **API Versioning**

   - Implement URI versioning strategy
   - Version management for breaking changes

8. **Enhanced Validation**
   - Custom validation pipes
   - Request size limits
   - File upload validation
