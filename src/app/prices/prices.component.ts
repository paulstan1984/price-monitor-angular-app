import { DatePipe } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Category } from '../models/Category';
import { Price } from '../models/Price';
import { PricesSearchRequest } from '../models/PricesSearchRequest';
import { StatisticsValue, TimeIntervalRequest } from '../models/StatisticsRequest';
import { getEndOfMonth } from '../models/Utils';
import { CategoriesService } from '../services/Categories.service';
import { PricesService } from '../services/Prices.service';
import { StatisticsService } from '../services/statistics.service';
import { TotalPricesByCategComponent } from './totalpricesbycateg.component';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent extends BaseComponent {

  public prices: Price[];

  @Input()
  public preloaded: boolean = false;
  @Input()
  public totalAmount: number = undefined;

  @Input()
  public date: string = '';

  public page = 1;

  categSeries: StatisticsValue[];

  public categories: Category[];
  selectedCateg: number = 0;

  constructor(
    injector: Injector,
    private pricesService: PricesService,
    private categoriesService: CategoriesService,
    private statisticsService: StatisticsService,
    private alertController: AlertController,
    private datePipe: DatePipe,
    public modalController: ModalController
  ) {
    super(injector);
  }

  ionViewDidEnter() {
    this.pricesService.setAuthToken(this.getAuthToken());
    this.statisticsService.setAuthToken(this.getAuthToken());
    this.categoriesService.setAuthToken(this.getAuthToken());

    this.categoriesService
      .list(() => { }, () => { }, error => this.errorHandler(error))
      .subscribe(categories => {
        this.categories = categories;
      });

    this.page = 1;
    this.loadPrices(this.page, undefined);
  }

  public loadMetaData() {
    this.page = 1;
    this.loadPrices(this.page, undefined);
  }

  get Monthly(): boolean {

    if (this.prices) {
      for (let i = 0; i < this.prices.length - 1; i++) {
        let d1 = new Date(this.prices[i].created_at);
        let d2 = new Date(this.prices[i + 1].created_at);
        if (d1.getDate() !== d2.getDate()) {
          return true;
        }
      }
    }

    return false;
  }

  loadPrices(page: number, event: any) {

    let request: PricesSearchRequest;

    if (this.preloaded) {
      request = { page: page, page_size: 10, order_by: 'created_at', order_by_dir: 'DESC', date: this.date, category_ids: [this.selectedCateg] };
    } else {
      request = { page: page, page_size: 10, order_by: 'created_at', order_by_dir: 'DESC', category_ids: [this.selectedCateg] };
    }

    if (this.selectedCateg == 0) {
      delete (request.category_ids);
    }

    this.pricesService
      .search(request, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);

        if (!this.preloaded) {
          if (page == 1) {
            this.totalAmount = 0;
          }

          response.results.forEach(p => {
            this.totalAmount = parseFloat(this.totalAmount.toString()) + parseFloat(p.amount.toString());
          });
        }

        if (page == 1) {
          this.prices = response.results;
        }
        else {
          this.prices = [...this.prices, ...response.results];
        }

        if (event) {
          event.target.complete();

          if (page >= response.nr_pages) {
            event.target.disabled = true;
          }
        }
      })
  }

  loadData(event: any) {
    this.page++;
    this.loadPrices(this.page, event);
  }

  async delete(item: Price) {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.pricesService.delete(item, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
            .subscribe(_ => {
              this.setLoading(false);
              this.loadMetaData();
            })
        }
      }, 'No']
    }).then(a => a.present());
  }

  public isDateChanged(i: number) {
    if (i == 0) return true;

    let prevDate: Date = new Date(this.prices[i - 1].created_at);
    let date: Date = new Date(this.prices[i].created_at);

    let sPrevDate = prevDate.getFullYear() + '-' + (("0" + (prevDate.getMonth() + 1)).slice(-2)) + '-' + (("0" + prevDate.getDate()).slice(-2));
    let sDate = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));

    return sPrevDate != sDate;
  }

  getTotal(date: string | undefined) {
    let total: number = 0;

    if (this.prices) {
      this.prices.forEach(p => {
        if (date === undefined || this.datePipe.transform(p.created_at, this.dateFormat) == date) {
          total = parseFloat(total.toString()) + parseFloat(p.amount.toString());
        }
      })
    }

    return total;
  }

  public dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public loadCategStatistics() {

    const request = {
      StartDate: this.date,
      EndDate: this.date
    } as TimeIntervalRequest;

    if (this.date && this.date.length == 7) {
      request.StartDate = this.date + '-01';
      request.EndDate = this.date + '-' + getEndOfMonth(this.date);
    }

    this.statisticsService.getStatisticsByCategory(request, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.categSeries = response[0].series;

        this.modalController.create({
          component: TotalPricesByCategComponent,
          cssClass: 'my-custom-class',
          componentProps: {
            categSeries: this.categSeries
          }
        }).then(w => w.present());
      });
  }
}
