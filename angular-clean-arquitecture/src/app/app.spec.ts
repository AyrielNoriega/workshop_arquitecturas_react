import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '@core/config/api.config';
import { provideStorage } from '@core/providers/provide-storage';
import { AUTH_REPOSITORY } from '@features/auth/domain/ports/auth.repository';
import { AuthRepositoryImpl } from '@features/auth/data/repositories/auth.repository.impl';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStorage(),
        { provide: API_BASE_URL, useValue: 'https://dummyjson.com' },
        { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header nav', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header nav')).toBeTruthy();
  });
});
