import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  
  constructor(private cartSerive: CartService) {}

  ngOnInit(){
    this.cartItems = this.cartSerive.cartItems;

    this.cartSerive.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartSerive.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartSerive.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartSerive.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartSerive.decrementCart(cartItem);
  }

  removeCartItem(cartItem: CartItem) {
    this.cartSerive.removeCartItem(cartItem);
  }    
}
