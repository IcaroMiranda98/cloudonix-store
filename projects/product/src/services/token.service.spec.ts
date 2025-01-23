import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let getItemSpy: jasmine.Spy<(key: string) => string | null>;

  const TOKEN_KEY = 'token';
  const mockToken = 'mock-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService],
    });

    service = TestBed.inject(TokenService);

    // Limpa o localStorage antes de cada teste
    spyOn(localStorage, 'setItem').and.callThrough();
    getItemSpy = spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'removeItem').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#saveToken', () => {
    it('should save the token in localStorage', () => {
      service.saveToken(mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, mockToken);
    });
  });

  describe('#clearToken', () => {
    it('should remove the token from localStorage', () => {
      service.clearToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  describe('#getAuthToken', () => {
    it('should return the token from localStorage if it exists', () => {
      getItemSpy.and.returnValue(mockToken);
      const token = service.getAuthToken();
      expect(token).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should return an empty string if no token exists in localStorage', () => {
      getItemSpy.and.returnValue(null);
      const token = service.getAuthToken();
      expect(token).toBe('');
      expect(localStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  describe('#isTokenized', () => {
    it('should return true if a token exists', () => {
      spyOn(service, 'getAuthToken').and.returnValue(mockToken);
      const result = service.isTokenized();
      expect(result).toBeTrue();
      expect(service.getAuthToken).toHaveBeenCalled();
    });

    it('should return false if no token exists', () => {
      spyOn(service, 'getAuthToken').and.returnValue('');
      const result = service.isTokenized();
      expect(result).toBeFalse();
      expect(service.getAuthToken).toHaveBeenCalled();
    });
  });
});
