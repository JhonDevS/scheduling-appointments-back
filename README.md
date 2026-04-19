# Scheduling Appointments Backend

Backend API para el sistema de programación de citas.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Docker](#docker)
- [Documentación API](#documentación-api)
- [REST Client](#rest-client)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Variables de Entorno](#variables-de-entorno)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Requisitos Previos

- Node.js >= 22.21.1
- pnpm >= 9.0.0
- Docker & Docker Compose (opcional)
- PostgreSQL >= 14.0 (solo para desarrollo sin Docker)

## Instalación

```bash
# Instalar dependencias con pnpm
pnpm install

# Copiar archivo de entorno
cp .env.example .env

# Editar .env con tus credenciales de base de datos
```

## Uso

### Desarrollo Local (sin Docker)

```bash
# Iniciar servidor de desarrollo (con nodemon)
pnpm dev
```

### Producción Local (sin Docker)

```bash
# Iniciar servidor de producción
pnpm start
```

---

## Docker

### Desarrollo con PostgreSQL Local

```bash
# Iniciar todos los servicios (App + DB)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app
docker-compose logs -f db
```

### Acceder a PostgreSQL

```bash
# Conectarse al contenedor de la base de datos
docker exec -it scheduling-db psql -U postgres -d scheduling_db

# Ver tablas
\d
```

### Detener Servicios

```bash
# Detener sin borrar datos
docker-compose down

# Detener y borrar volúmenes (datos)
docker-compose down -v
```

### Solo Aplicación (usando DB externa)

```bash
docker-compose up -d app
```

### Construcción

```bash
# Reconstruir imagem
docker-compose build --no-cache

# Rebuild y levantar
docker-compose up -d --build
```

### Puertos

| Servicio | Puerto | Descripción           |
| -------- | ------ | --------------------- |
| app      | 3000   | API REST              |
| db       | 5432   | PostgreSQL            |
| docs     | 8080   | Swagger UI (opcional) |

---

## Documentación API

Una vez que el servidor está corriendo, accede a:

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

---

## REST Client

### Instalación

1. Instalar extensión **REST Client** en VSCode Marketplace
2. Buscar: `humao.rest-client`

### Uso

1. Abrir `http/requests.rest`
2. Click en **Send Request** arriba del endpoint
3. O usa `Ctrl+Alt+R` (Windows) / `Cmd+Alt+R` (Mac)

### Endpoints Disponibles

| Método | Endpoint         | Descripción  |
| ------ | ---------------- | ------------ |
| GET    | `/api/v1/health` | Health check |
| GET    | `/api-docs`      | Swagger UI   |
| GET    | `/api-docs.json` | OpenAPI JSON |

---

## Scripts Disponibles

| Comando             | Descripción                      |
| ------------------- | -------------------------------- |
| `pnpm start`        | Iniciar servidor producción      |
| `pnpm dev`          | Iniciar servidor desarrollo      |
| `pnpm build`        | Build (echo para este proyecto)  |
| `pnpm lint`         | Ejecutar ESLint                  |
| `pnpm lint:fix`     | Corregir errores ESLint          |
| `pnpm format`       | Formatear con Prettier           |
| `pnpm format:check` | Verificar formato                |
| `pnpm prepare`      | Instalar Husky hooks             |
| `pnpm release`      | Crear release (standard-version) |

---

## Estructura del Proyecto

```
scheduling-appointments-back/
├── .github/workflows/     # GitHub Actions
│   ├── ci.yml           # CI Pipeline
│   └── release.yml      # Release Pipeline
├── .husky/               # Git Hooks
│   ├── pre-commit       # Pre-commit hook
│   └── commit-msg       # Commit message hook
├── http/                 # REST Client
│   └── requests.rest    # Endpoints collection
├── src/
│   ├── config/          # Configuración
│   │   ├── database.js  # Sequelize config
│   │   └── swagger.js # Swagger config
│   ├── controllers/    # Capa Controller
│   │   └── healthController.js
│   ├── services/       # Capa Service
│   │   └── healthService.js
│   ├── dao/            # Data Access Object
│   │   └── database.js
│   ├── routes/         # Definiciones de rutas
│   │   ├── index.js
│   │   └── health.js
│   ├── middlewares/    # Middlewares Express
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── utils/          # Utilidades
│   │   ├── logger.js   # Winston config
│   │   └── response.js
│   ├── app.js         # Configuración Express
│   └── server.js     # Entry point
├── .dockerignore
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── commitlint.config.js
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## Arquitectura

Este proyecto sigue una arquitectura por capas:

```
Client Request
     │
     ▼
┌─────────────────┐
│ Routes          │  ← URL mapping, middleware
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Controllers      │  ← Request parsing, validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Services         │  ← Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DAO              │  ← Database operations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sequelize/PostgreSQL
└─────────────────┘
```

---

## Variables de Entorno

### Aplicación

| Variable    | Default     | Descripción         |
| ----------- | ----------- | ------------------- |
| PORT        | 3000        | Puerto del servidor |
| NODE_ENV    | development | Ambiente            |
| LOG_LEVEL   | info        | Nivel de logs       |
| API_VERSION | v1          | Versión API         |

### Base de Datos

| Variable    | Default       | Descripción        |
| ----------- | ------------- | ------------------ |
| DB_HOST     | localhost     | Host PostgreSQL    |
| DB_PORT     | 5432          | Puerto PostgreSQL  |
| DB_NAME     | scheduling_db | Nombre DB          |
| DB_USER     | postgres      | Usuario            |
| DB_PASSWORD | -             | Contraseña         |
| DB_SSL      | false         | Habilitar SSL      |
| DB_POOL_MAX | 10            | Conexiones máximas |
| DB_POOL_MIN | 0             | Conexiones mínimas |

### CORS

| Variable    | Default | Descripción      |
| ----------- | ------- | ---------------- |
| CORS_ORIGIN | \*      | Origen permitido |

---

## Contribuir

Este proyecto usa **Conventional Commits**. Formatea tus mensajes de commit así:

```
feat: agregar nuevo endpoint
fix: corregir bug
docs: actualizar documentación
style: formatear código
refactor: restructurar código
test: agregar tests
chore: mantenimiento
```

### Flujo de Trabajo

1. Crea una rama (`git checkout -b feature/mi-feature`)
2. Haz tus cambios
3. Commitea usando Conventional Commits
4. Push a la rama
5. Crea un Pull Request

---

## Licencia

MIT
