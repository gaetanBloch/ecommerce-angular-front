import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit, OnDestroy {
  totalPrice = 0.00;
  totalQuantity = 0;
  private totalPriceSubscription: Subscription;
  private totalQuantitySubscription: Subscription;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(price => {
      this.totalPrice = price;
    });
    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(quantity => {
      this.totalQuantity = quantity;
    });
  }

  ngOnDestroy(): void {
    if (this.totalPriceSubscription) {
      this.totalPriceSubscription.unsubscribe();
    }
    if (this.totalQuantitySubscription) {
      this.totalQuantitySubscription.unsubscribe();
    }
  }
}
