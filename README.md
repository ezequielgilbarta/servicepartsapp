# Repuestos App

Gestión de ventas de repuestos de electrodomésticos.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno
cp .env.example .env
# Editá .env y configurá tu contraseña

# 3. Crear la base de datos y correr migraciones
npm run db:migrate

# 4. Generar el cliente de Prisma
npm run db:generate

# 5. (Opcional) Cargar datos de prueba
npm run db:seed

# 6. Iniciar el servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:migrate` | Correr migraciones |
| `npm run db:generate` | Regenerar cliente Prisma |
| `npm run db:studio` | Abrir Prisma Studio |
| `npm run db:seed` | Cargar datos de prueba |

## Estructura del proyecto

```
src/
├── app/
│   ├── api/auth/        # Login / logout
│   ├── login/           # Página de login
│   ├── ventas/          # Listado y detalle de ventas
│   ├── clientes/        # CRUD clientes
│   └── productos/       # CRUD productos
├── components/
│   ├── layout/          # AppLayout con navegación
│   └── ui/              # Componentes reutilizables
├── lib/
│   ├── prisma.ts        # Cliente Prisma singleton
│   ├── auth.ts          # Utilidades de autenticación
│   └── utils.ts         # Helpers (labels, formateo)
└── middleware.ts         # Protección de rutas
prisma/
├── schema.prisma        # Modelos de datos
└── seed.ts              # Datos de prueba
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Path a la base de datos SQLite (ej: `file:./dev.db`) |
| `APP_PASSWORD` | Contraseña de acceso a la app |
