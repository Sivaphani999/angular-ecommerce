import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl: string = environment.luv2shopApiUrl


  constructor(private httpClient:HttpClient) { }


    getProduct(productId: number) : Observable<any> {
        const searchUrl = `${this.baseUrl}/product/${productId}`;
        return this.httpClient.get(searchUrl);
    }
  searchProducts(keyword: string) {
    const searchUrl = `${this.baseUrl}/search/products?name=${keyword}`;
    return this.httpClient.get(searchUrl);
  }

  searchProductPaginate(theKeyword: string, thePage: number, thePageSize : number): Observable<any> {
    const searchUrl =  `${this.baseUrl}/search/products?name=${theKeyword}` + 
                `&pageNumber=${thePage}&pageSize=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }

  getProductListPaginate(theCategoryId: number, thePage: number, thePageSize : number): Observable<any> {
    const searchUrl =  `${this.baseUrl}/products/${theCategoryId}?` + 
                `pageNumber=${thePage}&pageSize=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<any> {
    const searchUrl =  `${this.baseUrl}/products/${theCategoryId}`;
    return this.httpClient.get(searchUrl);
  }

  getProductCategories(): Observable<any>{
    const searchUrl = `${this.baseUrl}/productCategory`
    return this.httpClient.get(searchUrl);
  }

}
