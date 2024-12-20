import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

interface PokemonFilters {
  type?: string;
  legendary?: string;
  minSpeed?: string;
  maxSpeed?: string;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly API_URL = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  get(page: number = 1, pageSize: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());

    return this.http.get<any[]>(
      `${this.API_URL}${API_CONFIG.endpoints.pokemon.home}`,
      { params }
    );
  }

  getPokemons(page: number, limit: number, filters: PokemonFilters): Observable<any> {
    // Xây dựng query params
    const params: any = {
      page,
      limit,
      ...filters
    };

    // Loại bỏ các params có giá trị rỗng
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    return this.http.get<any[]>(
      `${this.API_URL}${API_CONFIG.endpoints.pokemon.home}`,
      { params }
    );
  }

  uploadFile(file: File): Observable<any> { 
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(`${this.API_URL}${API_CONFIG.endpoints.pokemon.import}`, formData);
  }
}
