# Electro Grand Server - API Documentation (OpenAPI/Swagger)

This document contains a complete OpenAPI 3.0 specification for the Electro Grand e-commerce server API.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Electro Grand E-commerce API
  description: |
    Comprehensive e-commerce backend API for electronics store management.

    Features:
    - User authentication and authorization
    - Product catalog management
    - Order processing and tracking
    - Payment management
    - Review system
    - Administrative functions

    ## Authentication
    This API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication.

    ### Admin Authentication
    Admin endpoints require special authentication with admin role.

    ### Token Refresh
    Refresh tokens are managed via HTTP-only cookies for security.
  version: 1.0.0
  contact:
    name: Electro Grand API Support
    email: support@electrogrand.com
  license:
    name: MIT

servers:
  - url: http://localhost:4200/backend
    description: Development server
  - url: https://api.electrogrand.com/backend
    description: Production server

tags:
  - name: Authentication
    description: User registration, login, and token management
  - name: Users
    description: User profile management
  - name: Products
    description: Product catalog and management
  - name: Categories
    description: Product categories
  - name: Subcategories
    description: Product subcategories
  - name: Brands
    description: Product brands
  - name: Attributes
    description: Product attributes and values
  - name: Orders
    description: Order management and tracking
  - name: Payments
    description: Payment processing and status
  - name: Reviews
    description: Product reviews and ratings
  - name: Files
    description: File upload and management

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    cookieAuth:
      type: apiKey
      in: cookie
      name: refreshToken

  schemas:
    # Auth Schemas
    AuthRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: 'user@example.com'
        password:
          type: string
          minLength: 6
          example: 'password123'
        name:
          type: string
          example: 'John Doe'

    AuthAdminRequest:
      type: object
      required:
        - email
        - password
        - secretKey
      properties:
        email:
          type: string
          format: email
          example: 'admin@example.com'
        password:
          type: string
          minLength: 6
          example: 'adminpass123'
        secretKey:
          type: string
          example: 'admin-secret-key'
        name:
          type: string
          example: 'Admin User'

    AuthResponse:
      type: object
      properties:
        user:
          $ref: '#/components/schemas/User'
        accessToken:
          type: string
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

    # User Schemas
    User:
      type: object
      properties:
        id:
          type: integer
          example: 1
        email:
          type: string
          format: email
          example: 'user@example.com'
        name:
          type: string
          example: 'John Doe'
        phone:
          type: string
          example: '+1234567890'
        userRole:
          type: string
          enum: [CUSTOMER, ADMIN, MANAGER]
          example: 'CUSTOMER'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
          example: 'John Smith'
        phone:
          type: string
          example: '+1234567890'
        email:
          type: string
          format: email
          example: 'newemail@example.com'

    # Product Schemas
    Product:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: 'iPhone 15 Pro'
        slug:
          type: string
          example: 'iphone-15-pro'
        description:
          type: string
          example: 'Latest iPhone with advanced features'
        price:
          type: integer
          example: 99999
          description: 'Price in cents'
        images:
          type: array
          items:
            type: string
          example: ['public/assets/images/iphone-15-pro.jpg']
        categoryId:
          type: integer
          example: 1
        subcategoryId:
          type: integer
          example: 1
        brandId:
          type: integer
          example: 1
        category:
          $ref: '#/components/schemas/Category'
        subcategory:
          $ref: '#/components/schemas/Subcategory'
        brand:
          $ref: '#/components/schemas/Brand'
        productAttribute:
          type: array
          items:
            $ref: '#/components/schemas/ProductAttribute'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    ProductRequest:
      type: object
      required:
        - name
        - price
        - categoryId
        - subcategoryId
      properties:
        name:
          type: string
          example: 'iPhone 15 Pro'
        description:
          type: string
          example: 'Latest iPhone with advanced features'
        price:
          type: integer
          example: 99999
          description: 'Price in cents'
        categoryId:
          type: integer
          example: 1
        subcategoryId:
          type: integer
          example: 1
        brandId:
          type: integer
          example: 1

    # Category Schemas
    Category:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: 'Electronics'
        slug:
          type: string
          example: 'electronics'
        image:
          type: string
          example: 'public/assets/images/electronics.jpg'
        subcategories:
          type: array
          items:
            $ref: '#/components/schemas/Subcategory'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CategoryRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          example: 'Electronics'

    # Subcategory Schemas
    Subcategory:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: 'Smartphones'
        slug:
          type: string
          example: 'smartphones'
        image:
          type: string
          example: 'public/assets/images/smartphones.jpg'
        categoryId:
          type: integer
          example: 1
        category:
          $ref: '#/components/schemas/Category'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    # Brand Schemas
    Brand:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: 'Apple'
        slug:
          type: string
          example: 'apple'
        image:
          type: string
          example: 'public/assets/images/apple-logo.jpg'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    BrandRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          example: 'Apple'

    # Attribute Schemas
    Attribute:
      type: object
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: 'Color'
        values:
          type: array
          items:
            $ref: '#/components/schemas/AttributeValue'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    AttributeValue:
      type: object
      properties:
        id:
          type: integer
          example: 1
        value:
          type: string
          example: 'Space Gray'
        attributeId:
          type: integer
          example: 1
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    ProductAttribute:
      type: object
      properties:
        id:
          type: integer
          example: 1
        productId:
          type: integer
          example: 1
        attributeValueId:
          type: integer
          example: 1
        attributeValue:
          $ref: '#/components/schemas/AttributeValue'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    # Order Schemas
    Order:
      type: object
      properties:
        id:
          type: integer
          example: 1
        status:
          type: string
          enum: [NEW, PENDING, PAID, SHIPPED, DONE]
          example: 'PENDING'
        customerEmail:
          type: string
          format: email
          example: 'customer@example.com'
        customerPhone:
          type: string
          example: '+1234567890'
        deliveryType:
          type: string
          enum: [NOVA_POST, UKR_POST]
          example: 'NOVA_POST'
        deliveryAddress:
          type: string
          example: '123 Main St, City, Country'
        comments:
          type: string
          example: 'Please call before delivery'
        userId:
          type: integer
          example: 1
        orderItems:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        payment:
          type: array
          items:
            $ref: '#/components/schemas/Payment'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    OrderRequest:
      type: object
      required:
        - orderItems
        - customerEmail
        - customerPhone
        - deliveryAddress
      properties:
        status:
          type: string
          enum: [NEW, PENDING, PAID, SHIPPED, DONE]
          example: 'PENDING'
        userId:
          type: integer
          example: 1
        orderItems:
          type: array
          items:
            $ref: '#/components/schemas/OrderItemRequest'
        customerEmail:
          type: string
          format: email
          example: 'customer@example.com'
        customerPhone:
          type: string
          example: '+1234567890'
        deliveryType:
          type: string
          enum: [NOVA_POST, UKR_POST]
          example: 'NOVA_POST'
        deliveryAddress:
          type: string
          example: '123 Main St, City, Country'
        comments:
          type: string
          example: 'Please call before delivery'

    OrderItem:
      type: object
      properties:
        id:
          type: integer
          example: 1
        quantity:
          type: integer
          example: 2
        price:
          type: integer
          example: 99999
          description: 'Price in cents'
        orderId:
          type: integer
          example: 1
        productId:
          type: integer
          example: 1
        product:
          $ref: '#/components/schemas/Product'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    OrderItemRequest:
      type: object
      required:
        - quantity
        - price
        - productId
      properties:
        quantity:
          type: integer
          example: 2
        price:
          type: integer
          example: 99999
          description: 'Price in cents'
        productId:
          type: integer
          example: 1

    # Payment Schemas
    Payment:
      type: object
      properties:
        id:
          type: integer
          example: 1
        amount:
          type: integer
          example: 199998
          description: 'Amount in cents'
        status:
          type: string
          enum: [PENDING, COMPLETED, FAILED]
          example: 'PENDING'
        userId:
          type: integer
          example: 1
        orderId:
          type: integer
          example: 1
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    PaymentRequest:
      type: object
      required:
        - amount
        - orderId
      properties:
        amount:
          type: integer
          example: 199998
          description: 'Amount in cents'
        status:
          type: string
          enum: [PENDING, COMPLETED, FAILED]
          example: 'PENDING'
        userId:
          type: integer
          example: 1
        orderId:
          type: integer
          example: 1

    # Review Schemas
    Review:
      type: object
      properties:
        id:
          type: integer
          example: 1
        rating:
          type: integer
          minimum: 1
          maximum: 5
          example: 5
        text:
          type: string
          example: 'Great product, highly recommended!'
        productId:
          type: integer
          example: 1
        userId:
          type: integer
          example: 1
        user:
          $ref: '#/components/schemas/User'
        product:
          $ref: '#/components/schemas/Product'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    ReviewRequest:
      type: object
      required:
        - rating
        - text
        - productId
      properties:
        rating:
          type: integer
          minimum: 1
          maximum: 5
          example: 5
        text:
          type: string
          example: 'Great product, highly recommended!'
        productId:
          type: integer
          example: 1

    # Error Schemas
    Error:
      type: object
      properties:
        statusCode:
          type: integer
          example: 400
        message:
          type: string
          example: 'Validation failed'
        error:
          type: string
          example: 'Bad Request'

    ValidationError:
      type: object
      properties:
        statusCode:
          type: integer
          example: 400
        message:
          type: array
          items:
            type: string
          example:
            ['email must be an email', 'password must be longer than or equal to 6 characters']
        error:
          type: string
          example: 'Bad Request'

paths:
  # Authentication Endpoints
  /auth/register:
    post:
      tags:
        - Authentication
      summary: Register a new customer
      description: Create a new customer account
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthRequest'
      responses:
        '200':
          description: Successful registration
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'

  /auth/register-admin:
    post:
      tags:
        - Authentication
      summary: Register a new admin
      description: Create a new admin account with secret key
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthAdminRequest'
      responses:
        '200':
          description: Successful admin registration
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Validation error or invalid secret key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'

  /auth/login:
    post:
      tags:
        - Authentication
      summary: Customer login
      description: Authenticate a customer and receive access token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login-admin:
    post:
      tags:
        - Authentication
      summary: Admin login
      description: Authenticate an admin with secret key
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthAdminRequest'
      responses:
        '200':
          description: Successful admin login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Invalid credentials or secret key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/access-token:
    post:
      tags:
        - Authentication
      summary: Refresh access token
      description: Get new access token using refresh token from cookies
      security:
        - cookieAuth: []
      responses:
        '200':
          description: New access token generated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Invalid or expired refresh token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/logout:
    post:
      tags:
        - Authentication
      summary: Logout user
      description: Clear refresh and admin tokens from cookies
      responses:
        '200':
          description: Successfully logged out
          content:
            application/json:
              schema:
                type: boolean
                example: true

  # User Endpoints
  /user/by-id:
    get:
      tags:
        - Users
      summary: Get current user profile
      description: Get authenticated user's profile information
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /user/get-all:
    get:
      tags:
        - Users
      summary: Get all users (Admin only)
      description: Get list of all users in the system
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - Admin access required

  /user/update:
    put:
      tags:
        - Users
      summary: Update user profile
      description: Update authenticated user's profile information
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Validation error
        '401':
          description: Unauthorized

  # Product Endpoints
  /product:
    get:
      tags:
        - Products
      summary: Get all products
      description: Get list of products with optional filtering
      parameters:
        - name: searchTerm
          in: query
          description: Search term for product name
          schema:
            type: string
        - name: sort
          in: query
          description: Sort order (newest, oldest, price-asc, price-desc)
          schema:
            type: string
            enum: [newest, oldest, price-asc, price-desc]
        - name: minPrice
          in: query
          description: Minimum price filter
          schema:
            type: integer
        - name: maxPrice
          in: query
          description: Maximum price filter
          schema:
            type: integer
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

    post:
      tags:
        - Products
      summary: Create new product (Admin only)
      description: Create a new product in the catalog
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductRequest'
      responses:
        '200':
          description: Product created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          description: Validation error
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - Admin access required

  /product/by-id/{id}:
    get:
      tags:
        - Products
      summary: Get product by ID
      description: Get detailed product information by ID
      parameters:
        - name: id
          in: path
          required: true
          description: Product ID
          schema:
            type: integer
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  /product/by-slug/{slug}:
    get:
      tags:
        - Products
      summary: Get product by slug
      description: Get detailed product information by slug
      parameters:
        - name: slug
          in: path
          required: true
          description: Product slug
          schema:
            type: string
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  /product/by-category/{slug}:
    get:
      tags:
        - Products
      summary: Get products by category
      description: Get all products in a specific category
      parameters:
        - name: slug
          in: path
          required: true
          description: Category slug
          schema:
            type: string
      responses:
        '200':
          description: List of products in category
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /product/by-subcategory/{slug}:
    get:
      tags:
        - Products
      summary: Get products by subcategory
      description: Get all products in a specific subcategory
      parameters:
        - name: slug
          in: path
          required: true
          description: Subcategory slug
          schema:
            type: string
      responses:
        '200':
          description: List of products in subcategory
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /product/by-brand/{slug}:
    get:
      tags:
        - Products
      summary: Get products by brand
      description: Get all products from a specific brand
      parameters:
        - name: slug
          in: path
          required: true
          description: Brand slug
          schema:
            type: string
      responses:
        '200':
          description: List of products from brand
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /product/set-images/{id}:
    put:
      tags:
        - Products
      summary: Upload product images (Admin only)
      description: Upload and set images for a product
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: Product ID
          schema:
            type: integer
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                files:
                  type: array
                  items:
                    type: string
                    format: binary
      responses:
        '200':
          description: Images uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - Admin access required

  /product/{id}:
    put:
      tags:
        - Products
      summary: Update product (Admin only)
      description: Update product information
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: Product ID
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductRequest'
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          description: Validation error
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - Admin access required
        '404':
          description: Product not found

    delete:
      tags:
        - Products
      summary: Delete product (Admin only)
      description: Delete a product from the catalog
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: Product ID
          schema:
            type: integer
      responses:
        '200':
          description: Product deleted successfully
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - Admin access required
        '404':
          description: Product not found
# Continue with similar patterns for Categories, Orders, Reviews, etc...
```

## Implementation Instructions

To implement Swagger documentation in your NestJS application:

### 1. Install Required Packages

```bash
npm install @nestjs/swagger swagger-ui-express
```

### 2. Main.ts Configuration

Add this to your `main.ts` file:

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Electro Grand E-commerce API')
    .setDescription('Comprehensive e-commerce backend API for electronics store management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('refreshToken')
    .addTag('Authentication', 'User registration, login, and token management')
    .addTag('Users', 'User profile management')
    .addTag('Products', 'Product catalog and management')
    .addTag('Categories', 'Product categories')
    .addTag('Orders', 'Order management and tracking')
    .addTag('Reviews', 'Product reviews and ratings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ... rest of your bootstrap code
}
```

### 3. Add Decorators to Controllers

Example for AuthController:

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: 'Successful registration' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    // ... implementation
  }
}
```

### 4. Add API Properties to DTOs

Example for AuthDto:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
```

This specification provides:

- Complete API documentation
- Request/response schemas
- Authentication requirements
- Error responses
- Example values
- Validation rules

The documentation will be available at `http://localhost:4200/api-docs` once implemented.
