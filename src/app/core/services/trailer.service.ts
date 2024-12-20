import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root' // Đảm bảo service này có thể sử dụng toàn ứng dụng
})
export class TrailerService {

  private readonly API_URL = API_CONFIG.baseUrl;// URL API của bạn

  constructor(private http: HttpClient) { }

  // Phương thức để gọi API và trả về Observable
  getTrailers(): Observable<any[]> {
    console.log(`${this.API_URL}${API_CONFIG.endpoints.trailer}`)
    return this.http.get<any[]>(`${this.API_URL}${API_CONFIG.endpoints.trailer}`);
  }
}
