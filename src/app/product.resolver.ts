/*import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from './core/services/item.service';
import { Item } from './core/types/types';

@Injectable({
  providedIn: 'root', 
})
export class ProductResolver implements Resolve<Observable<Item>> {
  constructor(private dataService: ItemService) {}

  resolve(): Observable<Item> {
    return this.dataService.getItem('1'); 
  }
}
*/
