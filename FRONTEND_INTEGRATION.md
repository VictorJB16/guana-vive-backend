# Frontend Integration Guide - GuanaVive

## 🔌 Backend Configuration

### URLs
- **Development:** `http://localhost:3000`
- **Database:** PostgreSQL on port `15432`

### CORS Configuration
Backend está configurado para aceptar requests desde:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- `http://localhost:4173` (Vite preview)

## 📡 API Endpoints

### Authentication

#### 1. Register (Crear cuenta)
```typescript
POST /auth/register
Content-Type: application/json

// Request Body
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}

// Response (201 Created)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid-here",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-10-30T...",
    "updatedAt": "2025-10-30T..."
  }
}

// Error Response (400/409)
{
  "success": false,
  "message": "El email ya está registrado",
  "statusCode": 409
}
```

#### 2. Login (Iniciar sesión)
```typescript
POST /auth/login
Content-Type: application/json

// Request Body
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

// Response (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true
  }
}

// Error Response (401)
{
  "message": "Credenciales inválidas",
  "statusCode": 401
}
```

#### 3. Refresh Token
```typescript
POST /auth/refresh
Content-Type: application/json

// Request Body
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response (200 OK)
{
  "access_token": "new-access-token...",
  "refresh_token": "new-refresh-token..."
}
```

### Protected Endpoints (Require Authorization)

#### Get Current User Profile
```typescript
GET /auth/me
Authorization: Bearer <access_token>

// Response (200 OK)
{
  "id": "uuid-here",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-30T...",
  "updatedAt": "2025-10-30T..."
}
```

#### List Users (Paginated)
```typescript
GET /users?page=1&limit=10
Authorization: Bearer <access_token>

// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "email": "user1@example.com",
      "firstName": "María",
      "lastName": "González",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-10-30T...",
      "updatedAt": "2025-10-30T..."
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## 🔧 Frontend Integration

### 1. Environment Variables (.env)

Create `.env` file in frontend root:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# Token storage key
VITE_AUTH_TOKEN_KEY=guana_vive_token
VITE_REFRESH_TOKEN_KEY=guana_vive_refresh_token
```

### 2. Update authService.tsx

```typescript
// src/services/authServices.tsx
import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/loginType";
import { https } from "./https";

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "guana_vive_token";
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || "guana_vive_refresh_token";

export const authService = {
  async login(dto: LoginDTO): Promise<AuthResponse> {
    // POST /auth/login
    const response = await https.post<{
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        isActive: boolean;
      };
    }>("/auth/login", dto);

    // Guardar tokens
    localStorage.setItem(TOKEN_KEY, response.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);

    // Mapear respuesta del backend a formato frontend
    const user = {
      id: response.user.id,
      email: response.user.email,
      name: `${response.user.firstName} ${response.user.lastName}`,
      username: response.user.email, // usar email como username
      avatar: undefined,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("current_user", JSON.stringify(user));
    return { token: response.access_token, user };
  },

  async register(dto: RegisterDTO): Promise<AuthResponse> {
    // Mapear campos del frontend al backend
    const backendDto = {
      email: dto.email,
      password: dto.password,
      firstName: dto.name.split(" ")[0] || dto.name,
      lastName: dto.name.split(" ").slice(1).join(" ") || "",
    };

    // POST /auth/register
    const response = await https.post<{
      success: boolean;
      message: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        isActive: boolean;
      };
    }>("/auth/register", backendDto);

    // Después de registrar, hacer login automático
    return this.login({ email: dto.email, password: dto.password });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("current_user");
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getCurrentUser() {
    const raw = localStorage.getItem("current_user");
    return raw ? JSON.parse(raw) : null;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await https.post<{
      access_token: string;
      refresh_token: string;
    }>("/auth/refresh", { refreshToken });

    localStorage.setItem(TOKEN_KEY, response.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);

    return response.access_token;
  },
};
```

### 3. Update https.ts (Add Authorization Header)

```typescript
// src/services/https.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "guana_vive_token";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(init?.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // Si es 401, intentar refresh token
    if (res.status === 401 && path !== "/auth/login" && path !== "/auth/refresh") {
      try {
        const authService = await import("./authServices").then((m) => m.authService);
        await authService.refreshToken();
        // Reintentar request original
        return request<T>(path, init);
      } catch {
        // Si refresh falla, logout
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }

    let message = res.statusText;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw { message, status: res.status };
  }

  if (res.status === 204) return undefined as T;
  return await res.json() as T;
}

export const https = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
```

### 4. Update Types (loginType.tsx)

```typescript
// src/types/loginType.tsx
export type User = {
  id: string;
  email: string;
  name: string; // firstName + lastName del backend
  username: string; // email
  avatar?: string;
  createdAt?: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  name: string; // se dividirá en firstName/lastName
  username: string; // no se usa, se usa email
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string; // access_token del backend
  user: User;
};

export type ApiError = {
  message: string;
  status?: number;
  statusCode?: number;
  details?: unknown;
};
```

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd guana-vive-backend
docker-compose up -d  # Start PostgreSQL
pnpm run start:dev    # Start NestJS
```

Backend running on: `http://localhost:3000`

### 2. Start Frontend
```bash
cd Front-GuanaVive
npm install
npm run dev
```

Frontend running on: `http://localhost:5173`

### 3. Test Login Flow

1. Go to `http://localhost:5173/auth/register`
2. Create account with:
   - Name: "Juan Pérez"
   - Username: "juanperez" (ignored by backend)
   - Email: "juan@example.com"
   - Password: "password123"

3. Should redirect to login
4. Login with:
   - Email: "juan@example.com"
   - Password: "password123"

5. Should redirect to `/admin` dashboard

### 4. Verify in Browser DevTools

Check `localStorage`:
- `guana_vive_token`: JWT access token
- `guana_vive_refresh_token`: JWT refresh token  
- `current_user`: User object

Check Network tab:
- POST `/auth/register` → 201
- POST `/auth/login` → 200 with tokens
- GET `/users` → 200 with Authorization header

## 🐛 Common Issues

### CORS Error
```
Access to fetch at 'http://localhost:3000/auth/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:** Backend already configured. Check `.env` file has:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:4173
```

### 401 Unauthorized on Protected Routes
**Check:**
1. Token is saved in localStorage
2. Authorization header is being sent: `Bearer <token>`
3. Token is not expired (15m lifespan)

### Field Mapping Issues
Frontend fields → Backend fields:
- `name` → `firstName` + `lastName`
- `username` → Not used (backend uses email)
- `avatar` → Not implemented yet

## 🔐 Security Notes

1. **Tokens are stored in localStorage** (not cookies)
2. **Access token expires in 15 minutes**
3. **Refresh token expires in 7 days**
4. **Passwords are hashed with bcrypt** (10 rounds)
5. **All protected routes require JWT**

## 📝 Next Steps

1. ✅ CORS configured
2. ✅ Auth endpoints working
3. ✅ Token refresh mechanism
4. 🔜 Add interceptor for automatic token refresh
5. 🔜 Add loading states during requests
6. 🔜 Add error toast notifications
7. 🔜 Implement avatar upload
8. 🔜 Add remember me functionality

---

**Backend Repository:** https://github.com/VictorJB16/guana-vive-backend  
**Frontend Repository:** https://github.com/PinedaCR10/Front-GuanaVive

**Documentation:** See `.claude/` folder for development commands and context
