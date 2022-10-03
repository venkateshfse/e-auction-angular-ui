import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bid } from '../model/bid.model';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http: HttpClient) { }

  GetProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}e-auction/api/v1/seller/get-all-products`);
  }

  GetProductsByEmail(emailId: string) {
    return this.http.get<Product[]>(`${environment.apiUrl}e-auction/api/v1/seller/get-products/${emailId}`);
  }

  GetProduct(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}e-auction/api/v1/seller/get-product/${id}`);
  }
  
}
