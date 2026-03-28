# RutaViva ??

> Descubre, planea y gamifica tus aventuras en Medellín y Colombia.

RutaViva es una aplicación web de descubrimiento de lugares gamificada, construida para la **CubePath Hackathon 2026**. Los usuarios pueden explorar destinos, marcar lugares como deseados o visitados, ganar insignias y generar itinerarios de viaje personalizados con IA.

---

## Demo

> ?? `https://rutaviva.cubepath.app` *(disponible tras el despliegue)*

---

## Características

- **Exploración de lugares** — Navega por 18+ destinos reales en Medellín con filtros por categoría
- **Autenticación** — Registro e inicio de sesión con credenciales (email + contraseña con bcrypt)
- **Gamificación** — Sistema de insignias: Explorador, Aventurero, Gurmet, Viajero Elite
- **Lista de deseos y visitados** — Marca lugares para visitar o como ya visitados
- **Planificador IA** — Genera itinerarios personalizados con OpenAI gpt-4o-mini
- **Historial de planes** — Guarda y revisa tus planes de viaje anteriores

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Base de datos | PostgreSQL 16 |
| ORM | Prisma 5 |
| Autenticación | Auth.js v5 (Credentials) |
| IA | OpenAI gpt-4o-mini |
| Despliegue | Dokploy (Docker) |

---

## Uso de CubePath

Esta aplicación fue desplegada utilizando la infraestructura de **CubePath** a través de Dokploy:

1. Repositorio conectado a CubePath via Git
2. Build automático con el `Dockerfile` incluido
3. Variables de entorno configuradas en el panel de Dokploy
4. Base de datos PostgreSQL provisionada como servicio separado
5. Migraciones ejecutadas con `npx prisma migrate deploy` en el contenedor

---

## Instalación Local

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd hackaton-cubepath

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Copiar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Levantar PostgreSQL con Docker
docker compose up postgres -d

# 5. Ejecutar migraciones
npm run db:migrate

# 6. Poblar la base de datos
npm run db:seed

# 7. Iniciar el servidor de desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## Variables de Entorno

```env
DATABASE_URL="postgresql://rutaviva:rutaviva@localhost:5432/rutaviva?schema=public"
AUTH_SECRET="<genera-con-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

---

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run db:migrate   # Crea y aplica migraciones
npm run db:push      # Sincroniza schema sin migración
npm run db:seed      # Pobla la BD con datos de ejemplo
npm run db:studio    # Abre Prisma Studio
```

---

## Despliegue con Docker

```bash
# Build y levanta todo el stack
docker compose up --build -d

# Ejecutar migraciones en producción
docker compose exec app npx prisma migrate deploy

# Poblar datos iniciales
docker compose exec app npm run db:seed
```

---

## Estructura del Proyecto

```
+-- app/                    # Páginas (App Router)
¦   +-- page.tsx            # Home
¦   +-- explore/            # Explorador de lugares
¦   +-- places/[slug]/      # Detalle de lugar
¦   +-- my-places/          # Places del usuario + insignias
¦   +-- planner/            # Planificador IA
¦   +-- sign-in/            # Inicio de sesión
¦   +-- sign-up/            # Registro
+-- actions/                # Server Actions
+-- components/             # Componentes React
¦   +-- ui/                 # shadcn/ui components
+-- lib/                    # Utilidades (auth, db, constants)
+-- prisma/                 # Schema y seed
+-- types/                  # TypeScript types
```

---

## Equipo

- **Esteban** — Desarrollador Full Stack

---

*Construido con corazón para la CubePath Hackathon 2026*
