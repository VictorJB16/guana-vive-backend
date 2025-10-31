# Guana Vive Backend - Project Context

## 📋 Project Overview
**Name:** Guana Vive Backend  
**Type:** NestJS REST API  
**Purpose:** Backend system for Guana Vive platform with authentication and user management  
**Architecture:** Modular monolith (NO microservices - permanecerá como monolito modular)

## 🏗️ Current Architecture

### Technology Stack
- **Framework:** NestJS v10+ (Node.js/TypeScript)
- **Database:** PostgreSQL 15
- **ORM:** TypeORM with migrations
- **Authentication:** JWT (Access + Refresh tokens)
- **Validation:** class-validator
- **Container:** Docker & Docker Compose
- **Package Manager:** pnpm

### Module Structure
```
src/
├── auth/              # Authentication module (JWT, Register, Login)
├── users/             # Users CRUD module
├── config/            # Configuration (DB, JWT)
└── migrations/        # TypeORM migrations
```

### Current Modules
1. **Auth Module** - Complete JWT authentication with refresh tokens
2. **Users Module** - User CRUD operations with pagination
3. **Database** - PostgreSQL with TypeORM entities and migrations

## 🎯 Architecture Decisions

### Separation of Concerns (Monolith Modular)
- ✅ **Auth Module**: Only handles authentication (register, login, JWT)
- ✅ **Users Module**: Only handles user CRUD operations
- ✅ **Publications Module**: Content management system
- ✅ **Guards**: Centralized route protection
- ✅ **DTOs**: Input/output validation and typing
- ⚠️ **IMPORTANTE**: Este proyecto NO se convertirá en microservicios. Se mantendrá como monolito modular por diseño.

### Database Design
- Primary Keys: UUID v4
- Password Hashing: bcrypt
- Soft Deletes: Not implemented (hard deletes)
- Timestamps: createdAt, updatedAt (automatic)

### API Standards
- Response Format: `{ success: boolean, data: any, meta?: object }`
- Pagination: `{ page, limit, total, totalPages }`
- Error Handling: HTTP status codes + descriptive messages
- Authentication: Bearer token in Authorization header

## 🔒 Security Implementation

### JWT Configuration
- **Access Token:** 15 minutes expiration
- **Refresh Token:** 7 days expiration
- **Secrets:** Separate secrets for access and refresh tokens
- **Strategy:** Passport JWT with custom strategies

### Password Security
- Hashing: bcrypt (10 rounds)
- Validation: Minimum requirements (implement if needed)
- Storage: Never exposed in responses

## 📊 Database Schema

### Users Table (Current)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  isActive BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Development Standards

### Code Style
- TypeScript: Strict mode enabled
- No `any` types allowed
- Interfaces for all data structures
- DTOs for all endpoints

### Git Workflow
- **Main Branch:** Production-ready code
- **Develop Branch:** Integration branch
- **Feature Branches:** `feature/feature-name`
- Commit Convention: Conventional Commits (feat, fix, docs, config, refactor)

### Testing (To Implement)
- Unit tests: Jest
- E2E tests: Supertest
- Test coverage: Target 80%+

## 📈 Scalability Considerations (Monolith Architecture)

### Architecture Decision
**⚠️ IMPORTANTE:** Este proyecto es y permanecerá como un **monolito modular**. NO se planea migración a microservicios.

### Estrategia de Escalamiento
- **Vertical scaling**: Aumentar recursos del servidor (CPU, RAM)
- **Horizontal scaling**: Múltiples instancias del monolito con load balancer
- **Database scaling**: Read replicas, connection pooling
- **Caching**: Redis para reducir carga de DB

### Current Limitations
- Single database instance
- No caching layer
- No rate limiting
- No API versioning
- No monitoring/logging infrastructure

### Future Improvements Planned (Monolith-Focused)
1. ✅ Redis for caching and sessions
2. ✅ Rate limiting middleware (@nestjs/throttler)
3. ✅ API versioning strategy (v1, v2 endpoints)
4. ✅ Monitoring with Prometheus/Grafana
5. ✅ Centralized logging (Winston)
6. ✅ Database connection pooling
7. ✅ Background jobs (Bull/Queue system)
8. ✅ Load balancing (Nginx/HAProxy para múltiples instancias)

### What We Will NOT Do
- ❌ Split into microservices
- ❌ Service mesh (Istio, Linkerd)
- ❌ Message brokers between services (Kafka, RabbitMQ para inter-service communication)
- ❌ API Gateway for service routing
- ❌ Distributed tracing (OpenTelemetry para microservices)

## 🎯 Current Sprint Focus
- ✅ Complete Auth/Users separation
- ✅ JWT implementation with refresh tokens
- ✅ Basic CRUD operations
- ✅ Publications module with approval workflow
- ✅ Template and agent setup for better development workflow
- 🔜 Profile management enhancements
- 🔜 Advanced search and filters
- 🔜 File upload optimization
- 🔜 Performance tuning (caching, indexing)
- 🔜 Rate limiting implementation

### Architecture Principles
⚠️ **MONOLITH FIRST**: Todas las decisiones de arquitectura deben enfocarse en mejorar el monolito modular, NO en preparar para microservicios.

## 📝 API Documentation

### Implemented Endpoints
```
POST   /auth/register        - User registration
POST   /auth/login          - User login
POST   /auth/refresh        - Refresh access token
GET    /users               - List all users (paginated, protected)
GET    /users/:id           - Get user by ID (protected)
PATCH  /users/:id           - Update user (protected)
DELETE /users/:id           - Delete user (protected)
```

### Endpoint Protection
- Public: `/auth/register`, `/auth/login`
- Protected (JWT): All `/users/*` endpoints
- Admin Only: Not yet implemented

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=15432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=guana_vive_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

## 📚 Resources
- NestJS Documentation: https://docs.nestjs.com
- TypeORM Documentation: https://typeorm.io
- JWT Best Practices: https://jwt.io/introduction

---

**Last Updated:** October 30, 2025  
**Version:** 1.0.0 (MVP)  
**Status:** Active Development
