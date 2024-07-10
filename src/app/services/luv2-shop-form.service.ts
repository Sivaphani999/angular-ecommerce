import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countryUrl = environment.luv2shopApiUrl + '/country';
  private stateUrl = environment.luv2shopApiUrl + '/states';

  constructor(private httpClient:HttpClient) { }

  getCreditCartMonth(startMonth : number) : Observable<number[]> {
    let data = [];

    for(let theMonth = startMonth; theMonth <= 12 ; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears() : Observable<number[]> {
    let year = [];
    let currentYear = new Date().getFullYear();
    let endYear = currentYear + 10;

    for(let theYear = currentYear; theYear<= endYear; theYear++){
      year.push(theYear);
    }

    return of(year);
  }

  getCountries() : Observable<any> {
    return this.httpClient.get(this.countryUrl);
  }

  getStates(code : string) : Observable<any> {
    return this.httpClient.get(`${this.stateUrl}/search/findByCountryCode?code=${code}`);
  }

}
