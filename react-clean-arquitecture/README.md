# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## Estructura objetivo (de adentro hacia afuera)

```
src/
├── core/
│   ├── config/env.ts                 # API_URL = import.meta.env.VITE_API_URL ?? dummyjson
│   ├── http/HttpClient.ts            # cliente fetch genérico, configurable, ApiError
│   └── di/container.ts               # composición: instancia y cablea todo
├── features/auth/
│   ├── domain/
│   │   ├── entities/User.ts          # User
│   │   ├── entities/Session.ts       # Session (user + accessToken + refreshToken), AuthTokens
│   │   ├── value/Credentials.ts      # Credentials, AuthStatus
│   │   └── ports/
│   │       ├── AuthRepository.ts     # login / getMe / refresh / logout
│   │       └── SessionStorage.ts     # load / save / clear
│   ├── application/
│   │   ├── LoginUseCase.ts           # repo.login -> storage.save -> Session
│   │   ├── ValidateSessionUseCase.ts # repo.getMe -> actualiza user en storage -> User
│   │   └── LogoutUseCase.ts          # repo.logout -> storage.clear
│   ├── infrastructure/
│   │   ├── dto/auth.dto.ts           # UserDto, LoginResponseDto, RefreshResponseDto
│   │   ├── mappers/authMapper.ts     # toUser / toSession (DTO -> entidad)
│   │   ├── HttpAuthRepository.ts     # implementa AuthRepository con HttpClient
│   │   └── LocalStorageSessionStorage.ts # implementa SessionStorage
│   └── presentation/
│       ├── context/auth-context.ts   # createContext<AuthContextValue|null>
│       ├── context/AuthProvider.tsx  # estado UI; hidrata leyendo el puerto SessionStorage
│       ├── context/useAuth.ts
│       ├── hooks/useLogin.ts         # useMutation -> container.loginUseCase.execute
│       ├── hooks/useLogout.ts        # useMutation -> logoutUseCase + queryClient.clear
│       ├── hooks/useSessionValidation.ts # useQuery -> validateSessionUseCase
│       ├── components/LoginForm.tsx
│       ├── components/LogoutButton.tsx
│       ├── pages/LoginPage.tsx
│       ├── pages/DashboardPage.tsx
│       └── index.ts                  # barrel de la feature
└── app/
    ├── providers/AppProviders.tsx    # QueryProvider > ThemeProvider+CssBaseline > AuthProvider > AppRouter
    ├── providers/QueryProvider.tsx
    ├── router/paths.ts               # única fuente de rutas
    ├── router/AppRouter.tsx          # createBrowserRouter
    ├── router/SessionBoundary.tsx    # monta useSessionValidation, spinner si idle
    ├── router/ProtectedRoute.tsx
    ├── router/PublicRoute.tsx
    ├── layout/AppLayout.tsx          # AppBar + Outlet
    ├── theme/theme.ts
    └── components/FullPageSpinner.tsx
```

