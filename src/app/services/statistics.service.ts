import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StatisticsResponse, StatisticsRequest, TimeIntervalRequest } from '../models/StatisticsRequest';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'statistics';
  private DailyAvgURL = environment.ApiURL + 'avg-price/day';
  private CategoryStatsURL = environment.ApiURL + 'avg-price-category/day';

  constructor(http: HttpClient) { super (http); }

  public getStatistics(request: StatisticsRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<StatisticsResponse[]> {

    startCallback();

    return this.http
      .post<StatisticsResponse[]>(this.ApiURL, request, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<StatisticsResponse[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public getDailyAvgPrices(request: StatisticsRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<StatisticsResponse[]> {

    startCallback();

    return this.http
      .post<StatisticsResponse[]>(this.DailyAvgURL, request, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<StatisticsResponse[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public getStatisticsByCategory(request: TimeIntervalRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<StatisticsResponse[]> {

    startCallback();

    return this.http
      .post<StatisticsResponse[]>(this.CategoryStatsURL, request, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<StatisticsResponse[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }
}
