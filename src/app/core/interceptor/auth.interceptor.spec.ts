import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TokenService } from '../services/token.service';
import { AuthInterceptor } from './auth.interceptor';

class MockTokenService {
  private token: string | null = null;

  isTokenized(): boolean {
    return !!this.token;
  }

  getAuthToken(): string {
    return this.token || '';
  }

  setToken(token: string | null): void {
    this.token = token;
  }
}

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockTokenService: MockTokenService;

  beforeEach(() => {
    mockTokenService = new MockTokenService();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header if the token exists', () => {
    const token = 'test-token';
    mockTokenService.setToken(token);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('should not add an Authorization header if the token does not exist', () => {
    mockTokenService.setToken(null);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
