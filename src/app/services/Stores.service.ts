import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '../models/Store';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class StoresService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'stores';

  constructor(http: HttpClient) { super (http); }

  public list(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Store[]> {

    startCallback();

    return this.http
      .get<Store[]>(this.ApiURL,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Store[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public save(store: Store, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Store> {

    startCallback();

    let url = this.ApiURL;
    if(store!.id > 0){
      url += ('/' + store.id);
    }

    return this.http
      .put<Store>(url, store,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Store>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public delete(store: Store, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<any> {

    startCallback();

    let url = this.ApiURL + '/' + store.id;
    
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
