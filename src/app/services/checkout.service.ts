import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl : string = environment.luv2shopApiUrl +"/checkout/purchase";

  private paymentIntentUrl = environment.luv2shopApiUrl + "/checkout/payment-intent";

  constructor(private httpClient : HttpClient) { }

  placeOrder(purchase : Purchase) :Observable<any>{
    return this.httpClient.post(this.purchaseUrl , purchase);
  }

  createPaymentIntent(paymentInfo:PaymentInfo): Observable<any>{
    return this.httpClient.post<any>(this.paymentIntentUrl, paymentInfo);
  }
}
