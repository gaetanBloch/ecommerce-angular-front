import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { CartItem } from '../../cart/cart-item.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly ID = 'id';
  product: Product;
  private paramsSubscription: Subscription;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.handleProductDetails(params);
    });
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
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
