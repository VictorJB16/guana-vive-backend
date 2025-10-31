# 🤖 Claude Code Templates - Guana Vive Backend

Este directorio contiene la configuración de **Claude Code** para mejorar el desarrollo del backend de Guana Vive.

## 📁 Estructura

```
.claude/
├── agents/
│   └── backend-architect.md    # Agente especializado en arquitectura backend
├── project-context.md          # Contexto completo del proyecto
├── commands.md                 # Comandos útiles para desarrollo
└── README.md                   # Este archivo
```

## 🎯 ¿Qué es Claude Code?

Claude Code es una herramienta que permite configurar **agentes especializados** de Claude para tareas específicas de desarrollo. En este caso, hemos instalado el agente **backend-architect** que es experto en:

- 🏗️ Diseño de arquitectura de sistemas backend
- 🔌 Diseño de APIs RESTful
- 🗄️ Diseño de esquemas de base de datos
- 📈 Optimización de rendimiento
- 🔒 Patrones de seguridad básicos

## 🚀 Cómo Usar el Agente

### Activar el Agente Backend Architect

Cuando estés trabajando en el proyecto y necesites ayuda con arquitectura, simplemente menciona al agente:

```
@backend-architect necesito diseñar un nuevo módulo de productos
```

### Casos de Uso Comunes

1. **Diseñar nuevos endpoints:**
   ```
   @backend-architect necesito endpoints para gestión de productos con categorías y precios
   ```

2. **Revisar arquitectura:**
   ```
   @backend-architect revisa la arquitectura actual y sugiere mejoras de escalabilidad
   ```

3. **Diseñar esquemas de base de datos:**
   ```
   @backend-architect diseña el esquema para un sistema de pedidos con relaciones entre usuarios, productos y pagos
   ```

4. **Optimización de rendimiento:**
   ```
   @backend-architect sugiere estrategias de caching para el endpoint de usuarios
   ```

5. **Patrones de seguridad:**
   ```
   @backend-architect implementa rate limiting para los endpoints de autenticación
   ```

## 📚 Documentación Disponible

### 1. Project Context (`project-context.md`)
Documento completo con:
- Overview del proyecto
- Stack tecnológico actual
- Arquitectura y módulos
- Decisiones de diseño
- Estándares de código
- Consideraciones de escalabilidad

### 2. Commands Reference (`commands.md`)
Guía de comandos útiles para:
- Docker y base de datos
- Desarrollo de la aplicación
- Migraciones de TypeORM
- Testing manual y automatizado
- Git workflow
- Debugging y monitoreo

### 3. Backend Architect Agent (`agents/backend-architect.md`)
Configuración del agente especializado con:
- Áreas de enfoque
- Approach metodológico
- Formato de salida esperado

## 🎨 Beneficios de Usar el Agente

### ✅ Consistencia
- Respuestas alineadas con la arquitectura actual del proyecto
- Sugerencias que siguen las convenciones establecidas
- Código que respeta los estándares del equipo

### ✅ Especialización
- Respuestas enfocadas en backend y APIs
- Conocimiento profundo de NestJS y TypeORM
- Mejores prácticas de arquitectura

### ✅ Productividad
- Menos tiempo explicando el contexto del proyecto
- Respuestas más precisas y accionables
- Ejemplos de código listos para usar

### ✅ Escalabilidad
- Diseños pensados para crecimiento futuro
- Identificación temprana de bottlenecks
- Sugerencias de optimización proactivas

## 🔧 Configuración Adicional

### Variables de Contexto
El agente tiene acceso automático a:
- Estructura de directorios del proyecto
- Código fuente actual
- Configuraciones de Docker y TypeORM
- Documentación del proyecto

### Herramientas Disponibles
El agente puede:
- ✅ **Read**: Leer archivos del proyecto
- ✅ **Write**: Crear nuevos archivos
- ✅ **Edit**: Modificar archivos existentes
- ✅ **Bash**: Ejecutar comandos en terminal

### Modelo
- **Model:** Claude Sonnet (equilibrio entre velocidad y calidad)
- Para tareas más complejas, puedes solicitar cambiar a Opus

## 📖 Ejemplos de Interacción

### Ejemplo 1: Diseñar Nuevo Módulo
```
Usuario: @backend-architect necesito crear un módulo de productos con categorías, 
         imágenes y precios. Los productos pueden tener múltiples imágenes.

Agente: [Proporciona]
- Diseño de entidades (Product, Category, ProductImage)
- Endpoints RESTful completos
- DTOs de validación
- Esquema de base de datos con relaciones
- Consideraciones de rendimiento
```

### Ejemplo 2: Optimización
```
Usuario: @backend-architect el endpoint GET /users está lento cuando hay muchos usuarios.
         ¿Cómo puedo optimizarlo?

Agente: [Analiza y sugiere]
- Agregar índices en la base de datos
- Implementar paginación (ya existe)
- Agregar Redis para caching
- Optimizar query TypeORM
- Implementar cache-control headers
```

### Ejemplo 3: Seguridad
```
Usuario: @backend-architect necesito implementar rate limiting para evitar ataques de fuerza bruta
         en el login.

Agente: [Proporciona]
- Instalación de @nestjs/throttler
- Configuración del módulo
- Guards de rate limiting
- Estrategias por endpoint
- Manejo de errores 429
```

## 🎯 Mejores Prácticas

### ✅ DO
- Usa el agente para diseño de arquitectura
- Pide revisiones de código relacionadas con backend
- Solicita optimizaciones específicas
- Pregunta sobre patrones y mejores prácticas

### ❌ DON'T
- No uses el agente para frontend (usa otro agente especializado)
- No esperes respuestas sobre testing unitario detallado (usa testing agent)
- No uses para debugging de errores específicos (usa debug agent)

## 🔄 Actualizaciones

Para actualizar el agente y templates:

```bash
# Actualizar a la última versión
npx claude-code-templates@latest --agent=development-team/backend-architect --yes

# Ver versión actual
npx claude-code-templates@latest --version
```

## 📞 Soporte

- **Templates:** https://aitmpl.com
- **Documentación:** https://docs.aitmpl.com
- **GitHub:** https://github.com/cyanheads/claude-code-templates

## 🏆 Contribuciones

Si encuentras mejoras para el agente o la configuración:
1. Modifica los archivos en `.claude/`
2. Documenta los cambios
3. Crea un commit: `docs: actualizar configuración de claude-code`
4. Comparte con el equipo

---

**Instalado:** 30 de octubre de 2025  
**Versión Template:** 1.26.1  
**Agente:** backend-architect  
**Estado:** ✅ Activo y listo para usar
