import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config'; // Path to your API config file
import { TUser } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  // Method to get user info from the API
  getUserInfo(): Observable<TUser> {
    return this.http.get<any>(`${this.API_URL}${API_CONFIG.endpoints.profile}`);
  }
}