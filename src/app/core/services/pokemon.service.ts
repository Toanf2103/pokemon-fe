import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, pageSize: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any[]>(
      `${this.API_URL}${API_CONFIG.endpoints.pokemon.home}`,
      { params }
    );
  }
}
