import { InjectionToken } from '@angular/core';

/** Base URL de la API. Se provee en app.config.ts desde environment. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
