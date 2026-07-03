import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas de sesión: solo cliente — dependen de tokens que el servidor no tiene.
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  // Productos: SSR real (SEO). No Prerender en :id — exigiría enumerar IDs en build.
  { path: 'products', renderMode: RenderMode.Server },
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
