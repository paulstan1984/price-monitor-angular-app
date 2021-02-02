import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Price } from '../models/Price';
import { PricesSearchRequest } from '../models/PricesSearchRequest';
import { PricesSearchResponse } from '../models/PricesSearchResponse';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class PricesService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'prices';

  constructor(http: HttpClient) { super (http); }

  public list(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Price[]> {

    startCallback();

    return this.http
      .get<Price[]>(this.ApiURL,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Price[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public search(searchRequest: PricesSearchRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<PricesSearchResponse> {

    startCallback();

    return this.http
      .post<PricesSearchResponse>(this.ApiURL, searchRequest, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<PricesSearchResponse>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public save(price: Price, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Price> {

    startCallback();

    let url = this.ApiURL;
    if(price!.id > 0){
      url += ('/' + price.id);
    }

    return this.http
      .put<Price>(url, price,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Price>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public delete(price: Price, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<any> {

    startCallback();

    let url = this.ApiURL + '/' + price.id;
    
    return this.http
      .delete(url,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

}
