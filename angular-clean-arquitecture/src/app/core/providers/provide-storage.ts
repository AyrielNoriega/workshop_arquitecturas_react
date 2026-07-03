import { PLATFORM_ID, Provider, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { STORAGE } from '../storage/storage.token';
import { BrowserStorageService } from '../storage/browser-storage.service';
import { MemoryStorageService } from '../storage/memory-storage.service';

/** Factory SSR-safe: localStorage en browser, memoria en servidor. */
export function provideStorage(): Provider {
  return {
    provide: STORAGE,
    useFactory: () =>
      isPlatformBrowser(inject(PLATFORM_ID))
        ? new BrowserStorageService()
        : new MemoryStorageService(),
  };
}
