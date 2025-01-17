import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenService = inject(TokenService);
    if(tokenService.isThereToken()) {
      const token = tokenService.getAuthToken();
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}