import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn(cbkNotLogedIn: () => void) {
    let token = localStorage.getItem(environment.PriceMonitorToken);

    if (!token) {
      cbkNotLogedIn();
    }
  }

  logout() {
    localStorage.removeItem(environment.PriceMonitorToken);
  }

  login(password: string, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<LoginResponse> {

    startCallback();

    return this.http
      .post(environment.ApiURL + 'login', { Password: password })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  setToken(token: string) {
    localStorage.setItem(environment.PriceMonitorToken, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(environment.PriceMonitorToken);
  }
}


export interface LoginResponse {
  token: string;
}
