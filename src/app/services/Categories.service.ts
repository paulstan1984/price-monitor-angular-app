import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/Category';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'categories';

  constructor(http: HttpClient) { super (http); }

  public list(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Category[]> {

    startCallback();

    return this.http
      .get<Category[]>(this.ApiURL,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Category[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public save(Category: Category, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Category> {

    startCallback();

    let url = this.ApiURL;
    if(Category!.id > 0){
      url += ('/' + Category.id);
    }

    return this.http
      .put<Category>(url, Category,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Category>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public delete(categ: Category, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<any> {

    startCallback();

    let url = this.ApiURL + '/' + categ.id;
    
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
