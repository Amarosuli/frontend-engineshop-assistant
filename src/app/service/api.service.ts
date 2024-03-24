import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '../type/Api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  constructor(@Inject('tableName') private tableName: string) {}
  private baseUrl = 'http://localhost:8080/api/v1/' + this.tableName;

  get<T>(params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const options = { params, headers };
    return this.http.get<T>(`${this.baseUrl}`, options);
  }

  post<T>(body?: any, headers?: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.post<T>(`${this.baseUrl}`, body, options);
  }

  delete<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/delete/${id}`);
  }

  destroy<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/destroy/${id}`);
  }

  recover<T>(id: string, body?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/recover/${id}`, body);
  }

  createParams(objectParams: Params): HttpParams | undefined {
    return new HttpParams({ fromObject: objectParams });
  }
}
