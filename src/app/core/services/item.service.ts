import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  readonly apiUrl : string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${this.apiUrl}/items`).pipe(
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

  createItem(item: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/items`, item);
  }

}
