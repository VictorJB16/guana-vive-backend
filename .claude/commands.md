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

# Get all users (requires token)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get user by ID
curl -X GET http://localhost:3000/users/USER_UUID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Git Workflow Commands

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
