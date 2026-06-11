# Rol
Actúa como un **arquitecto de software senior** experto en React, frontend y en
**Clean Architecture** (Robert C. Martin). Piensa en voz alta las decisiones
arquitectónicas, justifica los trade-offs y respeta de forma estricta la **Regla
de Dependencia**: las dependencias del código solo apuntan hacia el centro
(dominio); lo de adentro no conoce lo de afuera.

# Objetivo
Implementar una aplicación React con **autenticación** equivalente, en
funcionalidad, a un proyecto hermano ya hecho con arquitectura *feature-first*,
pero reescrita bajo **Clean Architecture** (capas concéntricas + puertos y
adaptadores + casos de uso + inversión de dependencias).

El proyecto destino es `react-clean-arquitecture/`: plantilla **Vite + React 19 +
TypeScript** (con React Compiler activo) que hoy solo tiene `react`/`react-dom`.

# Stack obligatorio
- **Vite + React 19 + TypeScript**.
- **TanStack Query** para estado de servidor (mutaciones y queries).
- **Context API** para el estado de sesión global.
- **React Router** para el enrutado.
- **Material UI** (`@mui/material`, `@emotion/*`, `@mui/icons-material`) para estilos.

# Requisitos funcionales (idénticos al proyecto hermano)
Autenticación real contra la API pública **DummyJSON**:
- `POST /auth/login` → body `{ username, password, expiresInMins }` → responde
  user + `accessToken` + `refreshToken`.
- `GET /auth/me` con header `Authorization: Bearer <accessToken>` → user actual
  (para rehidratar/validar la sesión al cargar).
- `POST /auth/refresh` → body `{ refreshToken, expiresInMins }` → nuevos tokens.
- Credenciales demo: `emilys` / `emilyspass`.

Comportamiento esperado:
1. Login con el formulario → guarda sesión y navega al dashboard.
2. Tokens (access + refresh) y user persistidos en **localStorage**, con
   **rehidratación** al arrancar validando contra `/auth/me`.
3. Ante un **401**, intentar **refresh una sola vez** y reintentar; si falla,
   cerrar sesión.
4. **Rutas protegidas** (dashboard) y **públicas** (login) con guards y redirección.
5. **Logout** que limpia sesión + cache de Query y vuelve a login.
6. Variable de entorno `VITE_API_URL` (fallback `https://dummyjson.com`).

# Mandato arquitectónico (Clean Architecture)
Estructura la feature de auth en las **cuatro capas**, con la dependencia
apuntando siempre hacia `domain`:

```
src/
├── core/                         # transversal a toda la app
│   ├── di/                       # composición/inyección de dependencias (container)
│   └── http/                     # cliente HTTP genérico (detalle de infraestructura)
├── features/auth/
│   ├── domain/                   # CENTRO — sin React, sin fetch, sin MUI
│   │   ├── entities/             # User, Session (reglas/estructuras de negocio)
│   │   └── ports/                # interfaces: AuthRepository (login/getMe/refresh)
│   ├── application/              # USE CASES — orquestan el dominio, sin frameworks
│   │   ├── LoginUseCase.ts
│   │   ├── ValidateSessionUseCase.ts
│   │   └── LogoutUseCase.ts
│   ├── infrastructure/           # ADAPTERS — implementan los ports
│   │   ├── HttpAuthRepository.ts # usa core/http + DummyJSON; mapea DTO → entidad
│   │   └── dto/                  # tipos crudos de la API (no salen de esta capa)
│   └── presentation/             # FRAMEWORKS & DRIVERS — React
│       ├── context/              # AuthContext/Provider (estado de sesión)
│       ├── hooks/                # useLogin, useLogout, useSessionValidation (TanStack Query)
│       ├── components/           # LoginForm, LogoutButton
│       └── pages/                # LoginPage, DashboardPage
└── app/                          # composición raíz: providers, router, theme, layout
```

Reglas no negociables:
- **`domain` y `application` no importan React, ni TanStack Query, ni MUI, ni
  `fetch`/axios.** Son TypeScript puro y testeable en aislamiento.
- Los **use cases dependen de interfaces (`ports`)**, nunca de implementaciones.
  La implementación concreta (`HttpAuthRepository`) se **inyecta** (constructor /
  factory / container en `core/di`). Esto materializa la inversión de dependencia.
- La capa `presentation` (hooks de React) **invoca use cases**, no servicios ni
  fetch directos. TanStack Query envuelve la ejecución del use case.
- Los **DTO** de DummyJSON viven solo en `infrastructure`; hacia adentro solo
  viajan **entidades del dominio** (mapeo en el repositorio).
- El **estado de sesión** vive en el `AuthContext`; el **estado de servidor**
  (mutaciones/queries) en TanStack Query. No duplicar estado de servidor en el contexto.
- Las **rutas** se referencian desde un único `paths.ts` (single source of truth).

# Separación de responsabilidades (resumen)
- Context API → quién está logueado (user, status, tokens).
- TanStack Query → ejecutar mutaciones/queries (login, logout, validar /me).
- Use cases → la lógica de aplicación (orquestación), agnóstica de React.
- Repository (port + adapter) → cómo se habla con el backend, aislado tras interfaz.

# Cómo trabajar
1. Primero **explora** el proyecto y confirma el estado base; instala dependencias.
2. **Antes de codear**, presenta un plan corto: estructura de carpetas, qué va en
   cada capa, y cómo se cablea la inyección de dependencias. Señala explícitamente
   dónde se invierte cada dependencia.
3. Implementa de adentro hacia afuera: `domain` → `application` → `infrastructure`
   → `presentation` → `app` (composición).
4. Comenta el porqué arquitectónico en los puntos clave (ports, mapeos, DI).
5. Toma decisiones razonables como arquitecto; pregunta solo si algo cambia
   sustancialmente la estructura.

# Verificación (criterios de aceptación)
- `build` (tsc + vite) y `lint` sin errores.
- Login con `emilys`/`emilyspass` funciona contra DummyJSON y navega al dashboard.
- Recargar en una ruta protegida rehidrata y valida la sesión vía `/auth/me`.
- Un 401 dispara refresh + reintento; si el refresh falla, cierra sesión.
- Logout limpia sesión + cache y vuelve a login; entrar a /login ya logueado
  redirige al dashboard.
- **Prueba de fuego de la arquitectura:** los archivos de `domain/` y
  `application/` no contienen ningún import de `react`, `@mui/*`,
  `@tanstack/*` ni del cliente HTTP. Si los hubiera, la capa está mal ubicada.

# Extra (deseable)
- Que la inversión de dependencias permita **testear un use case** inyectando un
  `AuthRepository` falso (in-memory), sin tocar red ni React.
```
