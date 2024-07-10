import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.luv2shopApiUrl + '/orders';

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(theEmail: String) : Observable<any>{
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;
    return this.httpClient.get(orderHistoryUrl);
  }
}
