import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products!: any[];
  searchMode!: boolean;
  currentCategoryId: number = 1;
  previousCategoryId: number=1;
  previousKeyword: string = "";

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(private productService:ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ){}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProduct()
    })
  }

  listProduct() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProduct();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProduct(){
   const keyword = this.route.snapshot?.paramMap.get('keyword')!;

   if(this.previousKeyword != keyword){
    this.thePageNumber=1;
   }

   this.previousKeyword = keyword;

    this.productService.searchProductPaginate(keyword, this.thePageNumber-1, this.thePageSize).subscribe(this.processResult());
  }

  handleListProducts(){
     //check whether the id is available
     const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');


     console.log(`currentCategoryId = ${this.currentCategoryId}, pageNumber= ${this.thePageNumber}, pageSize= ${this.thePageSize}`);

     if(hasCategoryId){
       // convert id into a number.
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     }
     else{
       this.currentCategoryId = 1;
     }
     if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
     }

     this.previousCategoryId = this.currentCategoryId;

     console.log(`currentCategoryId = ${this.currentCategoryId}, pageNumber= ${this.thePageNumber}, pageSize= ${this.thePageSize}`);
 
     this.productService.getProductListPaginate(this.currentCategoryId, this.thePageNumber-1 , this.thePageSize).subscribe(this.processResult())
  }


  processResult(){
    return (response: any) =>{
      this.products = response.data.productDtoList;
      this.thePageNumber = response.data.pageNumber+1;
      this.thePageSize = response.data.pageSize;
      this.theTotalElements = response.data.totalElements;
    }
  }
  

  updatePageSize(pageSize: string){
    this.thePageSize = + pageSize;
    this.thePageNumber = 1;
    this.listProduct();
  }

  addToCart(product: any){
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
