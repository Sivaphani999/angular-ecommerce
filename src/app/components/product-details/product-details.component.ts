import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

    product!:Product;
    

    constructor(private productService: ProductService,
            private route:ActivatedRoute,
            private cartService: CartService
    ){}

    ngOnInit(){
        this.route.paramMap.subscribe(() =>{
            this.handleProductDetails();
        })
        
    }

    handleProductDetails() {
        const productId: number = +this.route.snapshot.paramMap.get('id')!;
        this.productService.getProduct(productId).subscribe((response: any) => {
            this.product = response.data;
            console.log(this.product);
        })
    }
    addToCart(product: Product) {
        let cartItem : CartItem = new CartItem(product);
        this.cartService.addToCart(cartItem);
    }
}
