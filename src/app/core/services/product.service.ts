import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  getItem(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/items/${id}`);
  }
  readonly apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.apiUrl}/items`)
      .pipe(
        map((data: Product[]) =>
          data.map(
            (item) =>
              new Product(
                item.id,
                item.name,
                item.description,
                item.sku,
                item.cost,
                item.profile,
              ),
          ),
        ),
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/items/${id}`);
  }
}
