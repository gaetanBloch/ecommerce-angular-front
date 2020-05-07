import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartItem } from '../cart-item.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0.00;
  totalQuantity = 0;
  private totalPriceSubscription: Subscription;
  private totalQuantitySubscription: Subscription;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(price => {
      this.totalPrice = price;
    });
    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(quantity => {
      this.totalQuantity = quantity;
    });
    this.cartService.computeCartTotals();
  }

  onIncrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
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
