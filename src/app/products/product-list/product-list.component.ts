import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { GetResponseProducts, ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly ID = 'id';
  private readonly KEYWORD = 'keyword';

  products: Product[];
  searchMode: boolean;
  categoryName: string;
  searchKeyword: string;

  // For pagination
  pageNumber = 0;
  pageSize = 10;
  totalElements = 0;

  private paramsSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.searchMode = params.has(this.KEYWORD);
      if (this.searchMode) {
        this.searchKeyword = params.get(this.KEYWORD) === '' ? 'All' : params.get(this.KEYWORD);
        this.handleSearchProducts(params);
      } else {
        this.handleProducts(params);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  handleSearchProducts(params: ParamMap): void {
    this.fetchSearchProducts(params.get(this.KEYWORD));
  }

  private fetchSearchProducts(keyword: string): void {
    this.productService.getProductsByKeyword(keyword, this.pageNumber, this.pageSize)
      .subscribe(this.handleResponseProducts.bind(this));
  }

  private handleProducts(params: ParamMap): void {
    if (params.has(this.ID)) {
      this.fetchProductsByCategoryId(+params.get(this.ID));
      this.fetchCategoryById(+params.get(this.ID));
    } else {
      this.fetchProducts();
      this.categoryName = 'All';
    }

    this.pageNumber = 0;
  }

  private fetchProducts(): void {
    this.productService.getProductList(this.pageNumber, this.pageSize)
      .subscribe(this.handleResponseProducts.bind(this));
  }

  private fetchProductsByCategoryId(categoryId: number): void {
    this.productService.getProductListByCategory(categoryId, this.pageNumber, this.pageSize)
      .subscribe(this.handleResponseProducts.bind(this));
  }

  private handleResponseProducts(response: GetResponseProducts) {
    this.products = response._embedded.products;
    this.pageNumber = response.page.number;
    this.pageSize = response.page.size;
    this.totalElements = response.page.totalElements;
  }

  private fetchCategoryById(categoryId: number) {
    this.productService.getProductCategoryById(categoryId).subscribe(productCategory => {
      this.categoryName = productCategory.categoryName;
    });
  }
}
