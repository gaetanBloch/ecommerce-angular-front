import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './models/product.model';
import { ProductCategory } from './models/product-category.model';

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  };
}

interface GetResponseProductCategories {
  _embedded: {
    product_categories: ProductCategory[]
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_PRODUCTS_URL = '/api/products';
  private readonly BASE_PRODUCT_CATEGORIES_URL = '/api/product-categories';

  constructor(private http: HttpClient) {
  }

  getProductList(): Observable<Product[]> {
    return this.getProductsByCondition('?size=100');
  }

  getProductListByCategory(categoryId: number): Observable<Product[]> {
    return this.getProductsByCondition(`/search/category-id?id=${categoryId}`);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<GetResponseProductCategories>(this.BASE_PRODUCT_CATEGORIES_URL)
      .pipe(
        map(result => result._embedded.product_categories)
      );
  }

  getProductCategoryById(id: number): Observable<ProductCategory> {
    return this.http
      .get<ProductCategory>(`${this.BASE_PRODUCT_CATEGORIES_URL}/${id}`);
  }

  getProductsByKeyword(keyword: string): Observable<Product[]> {
    return this.getProductsByCondition(`/search/name-contains?name=${keyword}&size=100`);
  }

  private getProductsByCondition(conditionUrl: string): Observable<Product[]> {
    return this.http
      .get<GetResponseProducts>(`${this.BASE_PRODUCTS_URL}${conditionUrl}`)
      .pipe(
        map(result => result._embedded.products)
      );
  }
}
