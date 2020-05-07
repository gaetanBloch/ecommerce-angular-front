import { Component, OnDestroy, OnInit } from '@angular/core';

import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly ID = 'id';
  product: Product;
  private paramsSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.handleProductDetails(params);
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  private handleProductDetails(params: ParamMap) {
    this.productService.getProduct(params.get(this.ID)).subscribe(product => {
      this.product = product;
    });
  }
}
