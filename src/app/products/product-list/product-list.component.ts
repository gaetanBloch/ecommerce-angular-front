import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  categoryName: string;
  private paramsSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      params.has('id') ? this.fetchProductsByCategoryId(+params.get('id')) : this.fetchProducts();

      if (params.has('name')) {
        this.categoryName = params.get('name');
      } else if (params.has('id')) {
        this.productService.getProductCategoryById(+params.get('id'))
          .subscribe(categoryProduct => {
            this.categoryName = categoryProduct.categoryName;
          });
      } else {
        this.categoryName = 'All';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
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
}
