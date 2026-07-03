# React Feature-First — Autenticación

App de referencia del workshop de arquitecturas. Implementa autenticación real
contra [DummyJSON](https://dummyjson.com/docs/auth) usando una arquitectura
**feature-first** con buena higiene de dependencias.

## Stack

- **Vite + React 19 + TypeScript** (React Compiler activo).
- **TanStack Query** — estado de servidor (mutaciones y queries).
- **Context API** — estado de sesión global.
- **React Router** — enrutado y guards.
- **Material UI** — componentes y theming.

## Arquitectura

Organización **feature-first** con vocabulario inspirado en *Feature-Sliced
Design*. La app se divide en tres capas y la **regla de oro** es que las
dependencias apuntan **siempre hacia abajo**:

```
  app/       composición: providers, router, layout, theme
    │  depende de ↓
  features/  dominio vertical autocontenido: auth, dashboard
    │  depende de ↓
  shared/    genérico, SIN dominio: api, lib, components
```

- `shared/` nunca importa de `features/` ni de `app/`.
- Una feature nunca importa rutas internas de otra: solo su **API pública**
  (`features/<x>/index.ts`).
- `app/` puede componer cualquier cosa (es el cableado de la aplicación).

> Nota de diseño: esto es *feature-first*, no FSD estricto. No hay capas
> `entities` / `widgets` / `pages` separadas; cada feature es un módulo grande
> que incluye sus propias páginas, estado y servicios.

### Estructura de carpetas

```
src/
├── app/                          # Composición raíz de la app
│   ├── providers/
│   │   ├── AppProviders.tsx      # Compone Query + Theme + Auth + Router
│   │   └── QueryProvider.tsx     # QueryClient + Devtools (solo dev)
│   ├── router/
│   │   ├── AppRouter.tsx         # createBrowserRouter + árbol de rutas
│   │   ├── SessionBoundary.tsx   # raíz: valida sesión y bloquea con spinner
│   │   ├── ProtectedRoute.tsx    # guard privado -> redirige a /login
│   │   ├── PublicRoute.tsx       # guard público -> redirige a /dashboard
│   │   └── paths.ts              # única fuente de verdad de rutas
│   ├── layout/AppLayout.tsx      # chrome autenticado (AppBar + Outlet)
│   └── theme/theme.ts            # createTheme de MUI
│
├── shared/                       # Transversal, sin lógica de negocio
│   ├── api/httpClient.ts         # wrapper de fetch + Bearer + refresh en 401
│   ├── lib/tokenStorage.ts       # persistencia neutra de tokens (localStorage)
│   └── components/layout/FullPageSpinner.tsx
│
├── environments/                 # Config por entorno (selección por MODE de Vite)
│   ├── env.config.ts             # selector + base de producción (VITE_API_URL)
│   ├── env.dev.ts                # valores de development
│   ├── env.test.ts               # valores de test
│   └── env.types.ts              # AppEnv
│
└── features/
    ├── auth/                     # Feature de referencia
    │   ├── components/           # LoginForm, LogoutButton
    │   ├── context/              # AuthProvider, auth-context, useAuth (estado de sesión)
    │   ├── hooks/                # useLogin, useLogout, useSessionValidation (TanStack Query)
    │   ├── services/             # auth.service — ÚNICO que conoce los endpoints
    │   ├── pages/                # LoginPage
    │   ├── types/                # User, Credentials, AuthSession, AuthStatus
    │   └── index.ts              # API pública de la feature
    └── dashboard/                # Feature protegida de ejemplo
        ├── pages/DashboardPage.tsx
        └── index.ts
```

## Flujo de autenticación

API: `POST /auth/login`, `GET /auth/me` (con `Authorization: Bearer`),
`POST /auth/refresh`. Credenciales demo: **`emilys` / `emilyspass`**.

1. **Login** — `LoginForm` dispara la mutación `useLogin` → `authService.login`
   mapea la respuesta de DummyJSON a una `AuthSession` del dominio → `AuthContext`
   la guarda y persiste tokens + user en `localStorage`.
2. **Navegación** — no es manual: al pasar el estado a `authenticated`, el guard
   `PublicRoute` redirige al dashboard.
3. **Rehidratación** — al arrancar, `AuthProvider` lee tokens/usuario del storage
   y el estado parte en `idle`. `SessionBoundary` (raíz del router) monta
   `useSessionValidation`, que valida el token contra `/auth/me` mostrando un
   spinner; resuelve a `authenticated` o `unauthenticated`.
4. **Refresh transparente** — ante un `401`, `httpClient` intenta `POST
   /auth/refresh` **una sola vez** (single-flight) y reintenta la petición; si
   falla, limpia los tokens.
5. **Logout** — `useLogout` limpia la sesión y vacía la cache de Query; el guard
   devuelve al login.

### Máquina de estados de sesión

```
        (sin token)                 /auth/me OK
  idle ───────────────► unauthenticated      idle ──────────► authenticated
   │  (con token, valida)                      │  login OK ▲        │ logout
   └──────────────────────────────────────────┘           └────────┘
```

## Separación de responsabilidades

| Tipo de estado | Dónde vive |
|---|---|
| Sesión (quién soy: user, status, tokens) | **Context API** (`AuthContext`) |
| Estado de servidor (login, logout, /me) | **TanStack Query** (hooks) |
| Estado local de UI | `useState` del componente |
| Cómo se habla con el backend | `auth.service` (único punto con endpoints) |

## Convenciones

- Cada feature expone su API pública por `index.ts`; nada externo importa rutas
  internas de otra feature.
- Las rutas se referencian desde `app/router/paths.ts`, nunca como strings sueltos.
- Los DTO/forma cruda del backend se mapean a tipos de dominio en `auth.service`.
- `tokenStorage` vive en `shared/lib` (neutro) para que `httpClient` pueda usarlo
  sin que `shared/` dependa de la feature de auth.

## Variables de entorno

La config se resuelve por **`import.meta.env.MODE`** de Vite:

- `development` (yarn dev) → `env.dev.ts`
- `test` (Vitest/CI) → `env.test.ts`
- `production` (build) → lee `VITE_API_URL` (fallback `https://dummyjson.com`)

En dev los valores salen de `env.dev.ts` (TypeScript); el `.env` con
`VITE_API_URL` solo aplica al build de producción.

## Scripts

```bash
yarn dev       # servidor de desarrollo
yarn build     # tsc -b && vite build
yarn lint      # eslint
yarn preview   # previsualizar el build
```

---

## Notas de la plantilla (Vite)

El React Compiler está activo (impacta el rendimiento de dev y build); ver la
[documentación](https://react.dev/learn/react-compiler). Para producción se
recomienda activar reglas de ESLint *type-aware* (`tseslint.configs
.recommendedTypeChecked` / `strictTypeChecked`) y, opcionalmente,
`eslint-plugin-react-x` y `eslint-plugin-react-dom`.
