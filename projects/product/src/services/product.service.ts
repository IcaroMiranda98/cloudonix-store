import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../src/environments/environment';
import { Product } from '../app/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly apiUrl: string = environment.apiUrl;
  private httpClient = inject(HttpClient);

  getProduct(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/items/${id}`);
  }

  createProduct(Product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.apiUrl}/items`, Product);
  }

  updateProduct(Product: Product): Observable<Product> {
    return this.httpClient
      .patch<Product>(`${this.apiUrl}/items/${Product.id}`, Product)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            console.error('Bad Request Error:', error.error.message);
          }
          return throwError(() => error);
        }),
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/items/${id}`);
  }
}
