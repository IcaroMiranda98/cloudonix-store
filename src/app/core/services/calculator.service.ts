import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn: 'root'})
export class CalculatorService {
  readonly apiUrl : string = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }
    //constructor(private httpClient: HttpClient) { }

  add(x: number, y: number) {
    return x + y;
  }
}