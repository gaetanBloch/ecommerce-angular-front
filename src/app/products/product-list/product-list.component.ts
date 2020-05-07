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
  private readonly ID = 'id';
  private readonly KEYWORD = 'keyword';
  products: Product[];
  categoryName: string;
  searchMode: boolean;
  searchKeyword: string;
  private paramsSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.searchMode = params.has(this.KEYWORD);
      if (this.searchMode) {
        this.searchKeyword = params.get(this.KEYWORD) === '' ?
          'All' : params.get(this.KEYWORD).trim();
        this.fetchSearchProducts(this.searchKeyword);
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

  private fetchSearchProducts(keyword: string): void {
    this.productService.getProductsByKeyword(keyword).subscribe(products => {
      this.products = products;
    });
  }

  private handleProducts(params: ParamMap): void {
    if (params.has(this.ID)) {
      this.fetchProductsByCategoryId(+params.get(this.ID));
      this.fetchCategoryById(+params.get(this.ID));
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
