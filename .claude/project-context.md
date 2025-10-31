# Guana Vive Backend - Context

**Stack:** NestJS + PostgreSQL + TypeORM + JWT  
**Architecture:** MODULAR MONOLITH (NO microservices)  
**Database:** PostgreSQL port 15432, credentials: postgres/admin

## Modules
- **auth/** - JWT authentication (access + refresh tokens, 15m/7d)
- **users/** - User CRUD with pagination
- **publications/** - Content management with approval workflow
- **config/** - DB and JWT configuration
- **migrations/** - TypeORM migrations

## Key Decisions
- **Architecture:** Monolith modular, NO microservices
- **Auth:** JWT with bcrypt, guards on all protected routes
- **Database:** UUIDs, TypeORM entities, automatic timestamps
- **API:** Standard format `{ success, data, meta }`, pagination included
- **Validation:** class-validator DTOs on all inputs

## Standards
- TypeScript strict, NO `any`
- DTOs + validation on all endpoints
- Git: main (prod) / develop (integration) / feature/* branches
- Commits: conventional (feat/fix/docs/config/refactor)

## Scaling Strategy (Monolith)
**Vertical + Horizontal scaling of monolith instances with load balancer**

### To Implement
- Redis caching
- Rate limiting (@nestjs/throttler)
- DB connection pooling
- Background jobs (Bull)

### NEVER Do
- ❌ Microservices migration
- ❌ Service mesh / API Gateway
- ❌ Message brokers for inter-service comm

## Environment
```env
DB_HOST=localhost
DB_PORT=15432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=guana_vive_db
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
```
