import { Injectable } from '@angular/core';

const KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  saveToken(token: string) {
    return localStorage.setItem(KEY, token)
  }

  clearToken() {
    localStorage.removeItem(KEY)
  }

  getAuthToken() {
    return localStorage.getItem(KEY) ?? ''
  }
  
  isThereToken() {
    return !!this.getAuthToken();
  }
}


