import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private static readonly ID = 'id';
  private static readonly KEYWORD = 'keyword';
  products: Product[];
  categoryName: string;
  searchMode: boolean;
  private paramsSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.searchMode = params.has(ProductListComponent.KEYWORD);
      if (this.searchMode) {
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

  private handleSearchProducts(params: ParamMap): void {
    this.fetchSearchProducts(params.get(ProductListComponent.KEYWORD));
  }

  private fetchSearchProducts(keyword: string): void {
    this.productService.searchProducts(keyword).subscribe(products => {
      this.products = products;
    });
  }

  private handleProducts(params: ParamMap): void {
    if (params.has(ProductListComponent.ID)) {
      this.fetchProductsByCategoryId(+params.get(ProductListComponent.ID));
      this.fetchCategoryById(+params.get(ProductListComponent.ID));
    } else {
      this.fetchProducts();
      this.categoryName = 'All';
    }
  }

  private fetchProducts(): void {
    this.productService.getProductList().subscribe(products => {
      this.products = products;
    });
  }

  private fetchProductsByCategoryId(categoryId: number): void {
    this.productService.getProductListByCategory(categoryId).subscribe(products => {
      this.products = products;
    });
  }

  private fetchCategoryById(categoryId: number) {
    this.productService.getProductCategoryById(categoryId).subscribe(productCategory => {
      this.categoryName = productCategory.categoryName;
    });
  }
}
