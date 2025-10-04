# Electro Grand Server

A comprehensive e-commerce backend API built with NestJS, TypeScript, and PostgreSQL. This server provides a complete solution for managing an online electronics store with advanced features including user authentication, product management, order processing, and administrative capabilities.

## 🚀 Features

- **🔐 Authentication & Authorization**: JWT-based auth with role management (Customer, Admin, Manager)
- **📱 Product Catalog**: Complete product management with categories, subcategories, brands, and attributes
- **🛒 Order Management**: Full order lifecycle with status tracking and payment integration
- **⭐ Review System**: Customer reviews and ratings for products
- **📁 File Management**: Image upload and management for products and categories
- **📧 Email Service**: Automated notifications for orders and user actions
- **🔧 Admin Panel**: Comprehensive administrative endpoints
- **🐳 Docker Support**: Ready for containerized deployment

## 🛠️ Technologies

- **Framework**: NestJS 10.0.0 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with refresh mechanism
- **File Upload**: Multer for image handling
- **Validation**: class-validator and class-transformer
- **Email**: Nodemailer for notifications
- **Security**: Argon2 password hashing, CORS enabled

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd server-electro-grand
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/electro_grand"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Admin Configuration
ADMIN_SECRET_KEY="your-admin-secret-key"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-email-password"

# Application Configuration
CLIENT_URL="http://localhost:3000"
PORT=4200
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: Seed the database with sample data
npm run seeder:all
```

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

The server will be available at `http://localhost:4200/backend`

## 🐳 Docker Deployment

### Using Docker

```bash
# Build the image
docker build -t electro-grand-server .

# Run the container
docker run -p 3001:3001 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  electro-grand-server
```

### Using Docker Compose

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
      - JWT_SECRET=your-jwt-secret
      - ADMIN_SECRET_KEY=your-admin-secret
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

Run with Docker Compose:

```bash
docker-compose up -d
```

## 📚 API Documentation

### Swagger/OpenAPI Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:4200/api-docs
```

### Quick API Overview

| Endpoint Group | Base Path           | Description                    |
| -------------- | ------------------- | ------------------------------ |
| Authentication | `/backend/auth`     | Login, register, token refresh |
| Users          | `/backend/user`     | User profile management        |
| Products       | `/backend/product`  | Product CRUD operations        |
| Categories     | `/backend/category` | Category management            |
| Orders         | `/backend/order`    | Order processing               |
| Reviews        | `/backend/review`   | Product reviews                |
| Files          | `/backend/files`    | File upload/management         |

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

Admin endpoints require admin role authentication.

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Customer and admin accounts
- **Products**: Product catalog with attributes
- **Categories/Subcategories**: Product organization
- **Brands**: Product manufacturers
- **Orders/OrderItems**: Order management
- **Payments**: Payment tracking
- **Reviews**: Customer feedback

## 📝 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Production
npm run build             # Build the application
npm run start:prod        # Start in production mode

# Database
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio

# Seeding
npm run seeder:all        # Seed all data
npm run seeder:products   # Seed products only

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## 🌍 Environment Variables

| Variable           | Required | Description                  | Default                 |
| ------------------ | -------- | ---------------------------- | ----------------------- |
| `DATABASE_URL`     | ✅       | PostgreSQL connection string | -                       |
| `JWT_SECRET`       | ✅       | JWT signing secret           | -                       |
| `JWT_EXPIRES_IN`   | ❌       | JWT expiration time          | `7d`                    |
| `ADMIN_SECRET_KEY` | ✅       | Admin registration secret    | -                       |
| `PORT`             | ❌       | Server port                  | `4200`                  |
| `CLIENT_URL`       | ❌       | Frontend URL for CORS        | `http://localhost:3000` |
| `SMTP_HOST`        | ❌       | Email SMTP host              | -                       |
| `SMTP_PORT`        | ❌       | Email SMTP port              | `587`                   |
| `SMTP_USER`        | ❌       | Email username               | -                       |
| `SMTP_PASSWORD`    | ❌       | Email password               | -                       |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Documentation

- 📖 [Technical Documentation](./docs/TECHNICAL_DOCUMENTATION.md) - Detailed technical overview
- 🔌 [API Documentation](./docs/SWAGGER_API_DOCUMENTATION.md) - Complete API reference
- 🤖 [Frontend API Guide](./docs/server-api-docs.md) - Frontend integration guide

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**Authentication Issues**

- Check JWT_SECRET is set
- Ensure tokens haven't expired
- Verify admin secret key for admin endpoints

**File Upload Problems**

- Check file permissions in public directory
- Verify multer configuration
- Ensure proper image formats

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation files
- Review the API documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using NestJS and TypeScript**
