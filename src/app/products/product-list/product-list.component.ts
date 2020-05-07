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
      params.has('id') ? this.fetchProducts(+params.get('id')) : this.fetchProducts(1);
      this.categoryName = params.has('name') ? params.get('name') : 'Books';
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  private fetchProducts(categoryId: number): void {
    this.productService.getProductList(categoryId).subscribe(products => {
      this.products = products;
    });
  }
}
