import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GetShoppingListPricesRequest, ShoppingList } from '../models/ShoppingList';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'shopping-list';
  private ApiURLRecognize = environment.ApiURL + 'recognize-invoice';
  private ApiURLGetListPrices = environment.ApiURL + 'recognize-prices';

  constructor(http: HttpClient) { super (http); }

  public get(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<ShoppingList> {

    startCallback();

    return this.http
      .get<ShoppingList>(this.ApiURL,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<ShoppingList>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public save(list: ShoppingList, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<ShoppingList> {

    startCallback();

    let url = this.ApiURL;
    
    return this.http
      .put<ShoppingList>(url, list,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<ShoppingList>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public recognizeImage(data: Blob, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<string[]> {

    startCallback();

    let url = this.ApiURLRecognize;
    
    return this.http
      .put<string[]>(url, data,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<string[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public getListPrices(getPricesRequest: GetShoppingListPricesRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<ShoppingList> {

    startCallback();

    let url = this.ApiURLGetListPrices;
    
    return this.http
      .put<ShoppingList>(url, getPricesRequest,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<ShoppingList>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }
}
