import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerData, CustomerRequest } from '../type/Customer';
import { ApiResponse, Params } from '../type/Api';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http: ApiService;

  constructor() {
    this.http = new ApiService('customer');
  }

  getCustomers(params: Params): Observable<ApiResponse<CustomerData[]>> {
    return this.http.get<ApiResponse<CustomerData[]>>(
      this.http.createParams(params)
    );
  }

  createCustomer(
    body: CustomerRequest,
    headers?: HttpHeaders
  ): Observable<ApiResponse<CustomerData>> {
    console.log(body);

    return this.http.post(body, headers);
  }

  deleteCustomer(id: string): Observable<ApiResponse<any>> {
    return this.http.delete(id);
  }

  destroyCustomer(id: string): Observable<ApiResponse<any>> {
    return this.http.destroy(id);
  }

  recoverCustomer(id: string): Observable<ApiResponse<any>> {
    return this.http.recover(id);
  }
}
