import { InjectionToken } from '@angular/core';
import { KeyValueStorage } from './storage.port';

export const STORAGE = new InjectionToken<KeyValueStorage>('STORAGE');
