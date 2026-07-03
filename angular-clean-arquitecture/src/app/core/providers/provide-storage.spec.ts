import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from '../storage/browser-storage.service';
import { MemoryStorageService } from '../storage/memory-storage.service';
import { STORAGE } from '../storage/storage.token';
import { provideStorage } from './provide-storage';

describe('provideStorage (SSR-safe)', () => {
  it('en browser usa localStorage (BrowserStorageService)', () => {
    TestBed.configureTestingModule({
      providers: [provideStorage(), { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    expect(TestBed.inject(STORAGE)).toBeInstanceOf(BrowserStorageService);
  });

  it('en servidor usa memoria (MemoryStorageService) — nunca toca localStorage', () => {
    TestBed.configureTestingModule({
      providers: [provideStorage(), { provide: PLATFORM_ID, useValue: 'server' }],
    });
    expect(TestBed.inject(STORAGE)).toBeInstanceOf(MemoryStorageService);
  });
});
