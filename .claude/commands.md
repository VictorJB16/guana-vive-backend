# Development Commands Reference

## 🚀 Quick Start Commands

### Docker & Database
```bash
# Start all services (app + database)
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Access database
docker-compose exec db psql -U postgres -d guana_vive_db

# Reset database (WARNING: Deletes all data)
docker-compose down -v && docker-compose up -d
```

### Application Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run start:dev

# Start production build
pnpm run build
pnpm run start:prod

# Run linter
pnpm run lint

# Format code
pnpm run format
```

## 🗄️ Database Operations

### TypeORM Migrations
```bash
# Generate migration from entity changes
pnpm run migration:generate -- src/migrations/MigrationName

# Run pending migrations
pnpm run migration:run

# Revert last migration
pnpm run migration:revert

# Show migration status
pnpm run migration:show
```

### Database Debugging
```bash
# Connect to PostgreSQL directly
docker-compose exec db psql -U postgres -d guana_vive_db

# List all tables
\dt

# Describe users table
\d users

# View all users
SELECT * FROM users;

# Check database size
SELECT pg_size_pretty(pg_database_size('guana_vive_db'));
```

## 🧪 Testing Commands

### Manual API Testing (curl)
```bash
# Register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Refresh token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# Get current user profile
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get all users (requires token)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get user by ID
curl -X GET http://localhost:3000/users/USER_UUID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test CORS from frontend
curl -X OPTIONS http://localhost:3000/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## � Frontend Integration Testing

### Start Backend + Frontend
```bash
# Terminal 1: Start backend
cd c:\guana-vive-backend\guana-vive-backend
docker-compose up -d
pnpm run start:dev

# Terminal 2: Start frontend (clone if needed)
git clone https://github.com/PinedaCR10/Front-GuanaVive.git
cd Front-GuanaVive
npm install
npm run dev

# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

### Test Authentication Flow
```bash
# 1. Register via frontend UI or curl
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@guanavive.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "GuanaVive"
  }'

# 2. Login and save token
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@guanavive.com",
    "password": "admin123"
  }' | jq -r '.access_token')

# 3. Test protected endpoint
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# 4. Test CORS
curl -X OPTIONS http://localhost:3000/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### Verify Frontend Connection
```bash
# Check frontend can reach backend
curl http://localhost:3000
# Should return API info or 404 with NestJS error format

# Check backend accepts CORS from frontend
curl -I -X OPTIONS http://localhost:3000/auth/login \
  -H "Origin: http://localhost:5173"
# Should see: Access-Control-Allow-Origin: http://localhost:5173
```

### Debug Integration Issues
```bash
# Backend logs
docker-compose logs -f app

# Check if backend is running
curl http://localhost:3000/auth/login
# Should return: 400/415 (method not allowed or content type issue)

# Check database connection
docker-compose exec db psql -U postgres -d guana_vive_db -c "SELECT COUNT(*) FROM users;"

# Check frontend can resolve backend
# In browser console (http://localhost:5173):
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## �🔧 Git Workflow Commands

### Feature Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: description of feature"

# Push feature branch
git push origin feature/feature-name

# Merge to develop
git checkout develop
git merge feature/feature-name
git push origin develop

# Merge to main (production)
git checkout main
git pull origin main
git merge develop
git push origin main
```

### Commit Message Convention
```bash
# Feature
git commit -m "feat: add user profile endpoint"

# Bug fix
git commit -m "fix: resolve JWT validation error"

# Documentation
git commit -m "docs: update API documentation"

# Configuration
git commit -m "config: update database credentials"

# Refactoring
git commit -m "refactor: separate auth from users module"

# Performance
git commit -m "perf: optimize user query with indexes"

# Tests
git commit -m "test: add unit tests for auth service"
```

## 🐛 Debugging Commands

### Check Service Status
```bash
# Check if app is running
curl http://localhost:3000

# Check database connection
docker-compose exec db pg_isready -U postgres

# View container status
docker-compose ps

# View container resource usage
docker stats
```

### Logs & Monitoring
```bash
# View app logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db

# View last 100 lines
docker-compose logs --tail=100 app

# Save logs to file
docker-compose logs app > app-logs.txt
```

## 📦 Package Management

### Adding Dependencies
```bash
# Production dependency
pnpm add package-name

# Development dependency
pnpm add -D package-name

# Update all dependencies
pnpm update

# Remove dependency
pnpm remove package-name

# Check outdated packages
pnpm outdated
```

## 🔒 Security Commands

### Generate Secrets
```bash
# Generate JWT secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT secret (PowerShell)
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

### Password Hashing Test
```bash
# Test bcrypt hashing in Node.js
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(console.log)"
```

## 🎯 Useful Aliases (Optional)

Add to your shell profile (.bashrc, .zshrc, or PowerShell profile):

```bash
# Docker shortcuts
alias dcu="docker-compose up -d"
alias dcd="docker-compose down"
alias dcl="docker-compose logs -f"
alias dcr="docker-compose down -v && docker-compose up -d"

# Development shortcuts
alias dev="pnpm run start:dev"
alias build="pnpm run build"
alias lint="pnpm run lint"

# Git shortcuts
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline -10"
```

## 📊 Performance Testing

### Using Apache Bench (ab)
```bash
# Install ab (if not installed)
# Windows: Download Apache binary
# Linux: apt-get install apache2-utils
# Mac: brew install apache2

# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:3000/auth/login

# Test protected endpoint with token
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" http://localhost:3000/users
```

### Using Artillery
```bash
# Install artillery
pnpm add -D artillery

# Run load test
artillery quick --count 10 --num 100 http://localhost:3000/users
```

---

**Pro Tips:**
- Always check logs when debugging: `docker-compose logs -f app`
- Use `.env` for environment variables (never commit it!)
- Test endpoints after changes: `curl` or Postman
- Keep migrations in sync with entity changes
- Commit frequently with clear messages
