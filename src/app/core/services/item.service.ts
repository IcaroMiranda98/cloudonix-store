import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  readonly apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.httpClient
      .get<Item[]>(`${this.apiUrl}/items`)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Item(
                item.id,
                item.name,
                item.description,
                item.sku,
                item.cost,
                item.profile
              )
          )
        )
      );
  }

  createItem(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(`${this.apiUrl}/items`, item);
  }

  updateItem(item: Item): Observable<Item> {
    return this.httpClient.put<Item>(`${this.apiUrl}/items/${item.id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/items/${id}`);
  }
}
