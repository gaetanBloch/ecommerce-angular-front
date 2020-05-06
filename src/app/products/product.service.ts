import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { map } from 'rxjs/operators';

interface GetResponse {
  _embedded: {
    products: Product[]
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProductList(categoryId: number): Observable<Product[]> {
    return this.http.get<GetResponse>('/api/products')
      .pipe(
        map(result => result._embedded.products)
      );
  }
}
