import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from './cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice = new Subject<number>();
  totalQuantity = new Subject<number>();

  constructor() {
  }

  addToCart(cartItem: CartItem) {
    // Check if we already have the item in our cart
    let alreadyExists = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      // Find the item in the cart
      existingCartItem = this.cartItems.find(value => value.id === cartItem.id);

      // Check if we found it
      alreadyExists = (existingCartItem !== undefined);
    }

    if (alreadyExists) {
      // Increment the quantity
      existingCartItem.quantity++;
    } else {
      // Add the cart item
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals(): void {
    let totalPrice = 0;
    let totalQuantity = 0;

    this.cartItems.forEach(cartItem => {
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalQuantity += cartItem.quantity;
    });

    // Publish the new totals
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.removeFromCart(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  removeFromCart(cartItem: CartItem) {
    const cartIndex = this.cartItems.findIndex(value => value.id === cartItem.id);
    if (cartIndex > -1) {
      this.cartItems.splice(cartIndex, 1);
      this.computeCartTotals();
    }
  }
}
