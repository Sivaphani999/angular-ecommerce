import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage : Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems') as string);

    if(data !== null){
      this.cartItems = data;

      this.computeCartTotals();
    }
   }

  addToCart(cartItem: CartItem){
    
    let alreadyExistInCart: boolean = false;
    let exsistingCartItem: any = undefined;

    if(this.cartItems.length > 0){
      exsistingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
      alreadyExistInCart = (exsistingCartItem !== undefined)
    }
    if(alreadyExistInCart){
      exsistingCartItem.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let cartItem of this.cartItems){
      totalPriceValue += cartItem.quantity * cartItem.unit_Price;
      totalQuantityValue += cartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.presistCartItems();
  }

  decrementCart(cartItem: CartItem) {
    
    cartItem.quantity--;

    if(cartItem.quantity == 0){
      this.removeCartItem(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  removeCartItem(cartItem : CartItem){
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id)

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
    }

    this.computeCartTotals();
  }

  presistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
