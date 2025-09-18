# 🌴 Guana Vive Backend

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  Backend API para la aplicación web <strong>Guana Vive</strong>, una plataforma dedicada a promocionar y adquirir cultura guanacasteca por medio de anuncios creados por los usuarios.
</p>

## 📖 Descripción

**Guana Vive** es una aplicación web que permite a los usuarios crear, publicar y descubrir anuncios relacionados con la rica cultura de Guanacaste, Costa Rica. A través de esta plataforma, los usuarios pueden promocionar eventos culturales, productos artesanales, servicios tradicionales, y experiencias auténticas que representen la esencia guanacasteca.

### 🎯 Objetivos del Proyecto

- **Promocionar la cultura guanacasteca** a través de una plataforma digital moderna
- **Facilitar la conexión** entre proveedores y consumidores de cultura local
- **Preservar y difundir** las tradiciones y costumbres de Guanacaste
- **Generar oportunidades económicas** para emprendedores culturales locales

### 🎯 Objetivos del Proyecto

- **Promocionar la cultura guanacasteca** a través de una plataforma digital moderna
- **Facilitar la conexión** entre proveedores y consumidores de cultura local
- **Preservar y difundir** las tradiciones y costumbres de Guanacaste
- **Generar oportunidades económicas** para emprendedores culturales locales

## 🚀 Características Principales

### 👥 Sistema de Usuarios
- Registro y autenticación segura con JWT
- Perfiles de usuario personalizables
- Roles de usuario (user/admin)
- Gestión de sesiones

### 📢 Sistema de Anuncios (Próximamente)
- Creación y publicación de anuncios culturales
- Categorías: eventos, productos, servicios, experiencias
- Búsqueda y filtrado avanzado
- Sistema de favoritos y recomendaciones

### 🏛️ Categorías Culturales
- **Eventos**: Festivales, conciertos, celebraciones tradicionales
- **Gastronomía**: Comida típica, restaurantes, recetas tradicionales
- **Artesanías**: Productos hechos a mano, arte local
- **Música y Danza**: Presentaciones folclóricas, clases de baile
- **Turismo Cultural**: Tours, sitios históricos, experiencias auténticas

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + bcrypt
- **Validación**: class-validator
- **Contenización**: Docker & Docker Compose
- **Gestión de Paquetes**: pnpm

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuraciones (DB, JWT, etc.)
├── users/            # Módulo de usuarios
│   ├── dto/          # Data Transfer Objects
│   ├── entities/     # Entidades de base de datos
│   ├── types/        # Tipos, interfaces y enums
│   └── ...
├── app.module.ts     # Módulo principal
└── main.ts          # Punto de entrada
```

## ⚙️ Configuración del Proyecto

## ⚙️ Configuración del Proyecto

### 📋 Prerrequisitos

- Node.js (v18 o superior)
- pnpm
- Docker y Docker Compose
- PostgreSQL (opcional si usas Docker)

### 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/VictorJB16/guana-vive-backend.git
cd guana-vive-backend
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Levantar la base de datos con Docker**
```bash
docker-compose up -d
```

5. **Ejecutar migraciones** (próximamente)
```bash
pnpm run migration:run
```

### 🚀 Ejecución

```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run start:prod
```

## 🔌 API Endpoints

### 👤 Usuarios (`/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/users` | Crear usuario |
| GET | `/users` | Listar usuarios con filtros |
| GET | `/users/:id` | Obtener usuario por ID |
| GET | `/users/email/:email` | Obtener usuario por email |
| PATCH | `/users/:id` | Actualizar usuario |
| PATCH | `/users/:id/change-password` | Cambiar contraseña |
| PATCH | `/users/:id/toggle-status` | Activar/desactivar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
| POST | `/users/validate` | Validar credenciales |
| POST | `/users/login` | Iniciar sesión |

## 🧪 Testing

```bash
## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Cobertura de tests
pnpm run test:cov
```

## 📊 Base de Datos

### 🏗️ Esquema Actual

#### Tabla `users`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hasheada)
- `firstName` (VARCHAR)
- `lastName` (VARCHAR)
- `role` (ENUM: 'user', 'admin')
- `isActive` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### 🔄 Migraciones

```bash
# Generar migración
pnpm run migration:generate -- src/migrations/MigrationName

# Ejecutar migraciones
pnpm run migration:run

# Revertir migración
pnpm run migration:revert
```

## 🌍 Variables de Entorno

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=guana_vive_db

# Aplicación
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🗺️ Roadmap

### ✅ Fase 1 - Fundación (Completada)
- [x] Configuración inicial del proyecto
- [x] Sistema de usuarios completo
- [x] Autenticación JWT
- [x] Base de datos PostgreSQL
- [x] Documentación base

### 🚧 Fase 2 - Sistema de Anuncios (En Desarrollo)
- [ ] Modelo de anuncios
- [ ] CRUD de anuncios
- [ ] Sistema de categorías
- [ ] Carga de imágenes
- [ ] Sistema de búsqueda

### 📅 Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de comentarios y valoraciones
- [ ] Notificaciones
- [ ] Sistema de mensajería
- [ ] Geolocalización
- [ ] Dashboard administrativo

### 🎨 Fase 4 - Mejoras UX/UI
- [ ] API de recomendaciones
- [ ] Estadísticas y analytics
- [ ] Integración con redes sociales
- [ ] Sistema de reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Victor Bustos** - [VictorJB16](https://github.com/VictorJB16)

## 🙏 Agradecimientos

- Inspirado en la rica cultura de Guanacaste, Costa Rica
- Construido con amor por la preservación cultural
- Dedicado a todos los guanacastecos que mantienen vivas sus tradiciones

---

<p align="center">
  <strong>¡Pura Vida! 🇨🇷</strong><br>
  Hecho con ❤️ para promover la cultura guanacasteca
</p>
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
