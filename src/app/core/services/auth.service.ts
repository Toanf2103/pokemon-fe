// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../../shared/models/auth.model';
import { API_CONFIG } from '../config/api.config';
import { TUser } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = API_CONFIG.baseUrl;
  private loginSubject = new Subject<void>(); 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('access_token');
    this.isAuthenticatedSubject.next(!!token);
  }

  register(credentials: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.API_URL}${API_CONFIG.endpoints.register}`,
        credentials
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('refresh_token', response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  emitLogin() {
    this.loginSubject.next(); // Khi người dùng đăng nhập, phát sự kiện
  }

  getLoginStatus() {
    return this.loginSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.API_URL}${API_CONFIG.endpoints.login}`,
        credentials
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('refresh_token', response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http
      .post<LoginResponse>(`${this.API_URL}${API_CONFIG.endpoints.refresh}`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('refresh_token', response.refreshToken);
        })
      );
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
}
