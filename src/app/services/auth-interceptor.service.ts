import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    const theEndPoint = environment.luv2shopApiUrl + '/orders';
    const securedEndPoints = [theEndPoint]

    if(securedEndPoints.some(url => request.urlWithParams.includes(url))){

      // get the access token
      const accessToken = this.oktaAuth.getAccessToken();
      

      //clone the request to add the access token to header
      // since the request is immutable we have cloned the request.
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+ accessToken
        }
      })

    }
    return await lastValueFrom(next.handle(request));
  }
}
