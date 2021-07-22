import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';
import { ProductsSearchRequest } from '../models/ProductsSearchRequest';
import { ProductsSearchResponse } from '../models/ProductsSearchResponse';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'products';

  constructor(http: HttpClient) { super(http); }

  public list(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Product[]> {

    startCallback();

    return this.http
      .get<Product[]>(this.ApiURL, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Product[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public search(searchRequest: ProductsSearchRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<ProductsSearchResponse> {

    startCallback();

    return this.http
      .post<ProductsSearchResponse>(this.ApiURL, searchRequest, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<ProductsSearchResponse>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public localStorageProducts = 'localStorageProducts';

  public localLoadProducts(name: string): Product[] {
    const retProducts = [];
    let products: Product[];

    try {
      products = JSON.parse(localStorage.getItem(this.localStorageProducts));
    }
    catch (error) {
      products = [];
    }

    if (!products) {
      products = [];
    }

    try {
      products.forEach(p => {
        if (p.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
          retProducts.push(p);
        }
      });
    } catch (error) {
      console.error(error);
    }

    return retProducts;
  }

  public localStoreProducts(searchResponse: ProductsSearchResponse) {
    let products: Product[];
    try {
      products = JSON.parse(localStorage.getItem(this.localStorageProducts));
    }
    catch (error) {
      products = [];
      console.error(error);
    }

    if (!products) {
      products = [];
    }

    try {
      searchResponse.results.forEach(np => {
        if (!products.find(p => p.name.toLowerCase() == np.name.toLowerCase())) {
          products.push(np);
        }
      });

      localStorage.setItem(this.localStorageProducts, JSON.stringify(products));
    } catch (error) {
      console.error(error);
    }
  }

  public save(product: Product, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<Product> {

    startCallback();

    let url = this.ApiURL;
    if (product!.id > 0) {
      url += ('/' + product.id);
    }

    return this.http
      .put<Product>(url, product, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<Product>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public delete(product: Product, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<any> {

    startCallback();

    let url = this.ApiURL + '/' + product.id;

    return this.http
      .delete(url, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

}
