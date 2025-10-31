# 🎓 Guía de Inicio Rápido - Claude Code Templates

## 🚀 ¡Bienvenido al Sistema de Agentes de Claude!

Has instalado exitosamente **Claude Code Templates** con el agente **Backend Architect**. Este agente está especializado en ayudarte con arquitectura backend, diseño de APIs, y optimización de sistemas.

## ✅ ¿Qué se ha instalado?

```
.claude/
├── agents/
│   └── backend-architect.md      ← Agente especializado en backend
├── project-context.md            ← Contexto completo del proyecto
├── commands.md                   ← Comandos útiles de desarrollo
└── README.md                     ← Documentación completa
```

## 🎯 Primeros Pasos

### 1️⃣ Activar el Agente

Para usar el agente, simplemente menciona su nombre en cualquier conversación con Claude:

```
@backend-architect [tu pregunta o tarea]
```

### 2️⃣ Ejemplos Prácticos

#### 🏗️ Diseñar un Nuevo Módulo
```
@backend-architect necesito crear un módulo de productos con las siguientes características:
- Categorías jerárquicas
- Múltiples imágenes por producto
- Gestión de precios e inventario
- Búsqueda y filtros avanzados
```

**El agente te proporcionará:**
- ✅ Diseño de entidades TypeORM
- ✅ Endpoints RESTful completos
- ✅ DTOs de validación
- ✅ Esquema de base de datos
- ✅ Consideraciones de rendimiento

#### 🔧 Optimizar Código Existente
```
@backend-architect el endpoint GET /users está lento cuando tengo más de 10,000 usuarios.
¿Qué estrategias de optimización recomiendas?
```

**El agente analizará y sugerirá:**
- ✅ Índices de base de datos
- ✅ Estrategias de caching (Redis)
- ✅ Optimización de queries TypeORM
- ✅ Paginación mejorada
- ✅ Cache-control headers

#### 🔒 Implementar Seguridad
```
@backend-architect necesito implementar rate limiting para proteger los endpoints
de autenticación contra ataques de fuerza bruta
```

**El agente te guiará en:**
- ✅ Instalación de @nestjs/throttler
- ✅ Configuración por endpoint
- ✅ Estrategias de rate limiting
- ✅ Manejo de errores 429
- ✅ Redis como backend de rate limiting

#### 📊 Revisar Arquitectura
```
@backend-architect revisa la arquitectura actual del proyecto y sugiere
mejoras para escalabilidad y mantenibilidad del monolito modular
```

**El agente evaluará:**
- ✅ Separación de responsabilidades en módulos
- ✅ Patrones de diseño aplicados
- ✅ Potenciales bottlenecks
- ✅ Mejoras de performance (caching, indexing)
- ✅ Estrategias de escalamiento horizontal del monolito

⚠️ **IMPORTANTE**: Este proyecto es un MONOLITO MODULAR y NO se convertirá en microservicios.

## 🎨 Casos de Uso Comunes

### 📝 Caso 1: Nuevo Feature
```
Situación: Necesito agregar gestión de perfiles de usuario con foto

Prompt:
@backend-architect diseña un sistema de perfiles de usuario que incluya:
- Upload de foto de perfil (max 5MB)
- Información extendida (bio, ubicación, redes sociales)
- Privacidad (perfil público/privado)
- Validación de campos

Resultado esperado:
- DTOs con validaciones
- Entidad de perfil con relación a User
- Endpoints CRUD completos
- Servicio de upload de imágenes
- Consideraciones de storage (local/S3)
```

### 🔄 Caso 2: Refactoring
```
Situación: Código legacy con lógica mezclada

Prompt:
@backend-architect tengo un UsersController que mezcla autenticación y CRUD.
Ayúdame a separar las responsabilidades en módulos independientes.

Resultado esperado:
- Plan de refactoring paso a paso
- Estructura de módulos Auth y Users
- Interfaces compartidas
- Migración de código sin breaking changes
```

### 🚀 Caso 3: Performance
```
Situación: Endpoint lento con múltiples joins

Prompt:
@backend-architect mi endpoint GET /publications con autor, categoría y comentarios
tarda 3 segundos. ¿Cómo lo optimizo?

Resultado esperado:
- Análisis del problema (N+1 queries)
- Solución con eager loading
- Implementación de caching
- Índices de base de datos
- Pagination strategy
```

## 📚 Recursos Adicionales

### Contexto del Proyecto
Lee el contexto completo en:
```bash
cat .claude/project-context.md
```

### Comandos Útiles
Consulta todos los comandos disponibles:
```bash
cat .claude/commands.md
```

### Documentación del Agente
```bash
cat .claude/agents/backend-architect.md
```

### 🎓 Mejores Prácticas

### ✅ DO (Hacer)
- ✅ Sé específico en tus preguntas
- ✅ Proporciona contexto cuando sea necesario
- ✅ Pide ejemplos de código concretos para NestJS
- ✅ Solicita diagramas de módulos (no microservicios)
- ✅ Pregunta sobre trade-offs de diferentes soluciones
- ✅ Enfócate en optimización del monolito

### ❌ DON'T (No hacer)
- ❌ Preguntas demasiado generales ("¿cómo hago un backend?")
- ❌ Temas fuera del scope (frontend, devops avanzado)
- ❌ Solicitar debugging de errores específicos sin contexto
- ❌ Pedir que escriba todo el código desde cero sin tu input
- ❌ **NUNCA pedir arquitectura de microservicios** (este es un MONOLITO)

## 💡 Tips Pro

### 1. Combina con otros agentes
```
# Para testing
@testing-agent crea tests e2e para el módulo de auth

# Para frontend
@frontend-architect diseña la interfaz que consume este API
```

### 2. Pide múltiples opciones
```
@backend-architect dame 3 opciones diferentes para implementar
un sistema de notificaciones (webhooks, websockets, polling)
con pros y contras de cada una
```

### 3. Solicita revisiones de código
```
@backend-architect revisa este servicio y sugiere mejoras:
[pega tu código]
```

### 4. Planificación de features
```
@backend-architect necesito planificar un sistema de pagos con Stripe.
Dame un roadmap con fases de implementación priorizadas.
```

## 🎯 Próximos Pasos

1. **Explora el agente**: Prueba con preguntas simples
2. **Lee la documentación**: Revisa los archivos en `.claude/`
3. **Practica**: Usa el agente en tu desarrollo diario
4. **Comparte feedback**: Mejora la configuración según tus necesidades

## 🆘 Soporte

- **Documentación oficial**: https://docs.aitmpl.com
- **Templates**: https://aitmpl.com
- **Issues**: Reporta problemas en el repo del proyecto

---

## 🎉 ¡Todo Listo!

Ya puedes empezar a usar el **Backend Architect Agent**. Simplemente menciona `@backend-architect` en tus conversaciones con Claude y observa cómo mejora tu productividad.

**Ejemplo para empezar:**
```
@backend-architect hola! estoy trabajando en el backend de Guana Vive.
¿Puedes darme un resumen rápido de la arquitectura actual?
```

¡Happy Coding! 🚀
