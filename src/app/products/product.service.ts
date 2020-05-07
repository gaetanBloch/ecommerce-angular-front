import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './models/product.model';
import { ProductCategory } from './models/product-category.model';

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
    page: {
      size: number;
      totalElements: number;
      totalPages: number;
      number: number;
    }
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

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_PRODUCTS_URL}/${productId}`);
  }

  getProductList(page: number, pageSize: number): Observable<GetResponseProducts> {
    return this.getProductsByCondition('', page, pageSize);
  }

  getProductListByCategory(categoryId: number, page: number, pageSize: number)
    : Observable<GetResponseProducts> {
    return this.getProductsByCondition(
      `/search/category-id?id=${categoryId}`,
      page,
      pageSize
    );
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

  getProductsByKeyword(keyword: string, page: number, pageSize: number)
    : Observable<GetResponseProducts> {
    return this.getProductsByCondition(
      `/search/name-contains?name=${keyword}`,
      page,
      pageSize
    );
  }

  private getProductsByCondition(conditionUrl: string, page: number, pageSize: number)
    : Observable<GetResponseProducts> {
    return this.http.get<GetResponseProducts>(
      `${this.BASE_PRODUCTS_URL}${conditionUrl}?page=${page}&size${pageSize}`
    );
  }
}
