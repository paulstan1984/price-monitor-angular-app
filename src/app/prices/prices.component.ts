import { DatePipe } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { PricesSearchRequest } from '../models/PricesSearchRequest';
import { PricesService } from '../services/Prices.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent extends BaseComponent  {

  @Input()
  public prices: Price[];

  @Input()
  public preloaded: boolean = false;

  constructor(
    injector: Injector,
    private pricesService: PricesService,
    private alertController: AlertController,
    private datePipe: DatePipe,
    public modalController: ModalController
  ) {
    super(injector);

    this.pricesService.setAuthToken(this.getAuthToken());
  }

  ionViewDidEnter() {
    if(!this.preloaded) {
      this.loadPrices();
    }
  }

  public loadMetaData() {
    this.loadPrices();
  }

  loadPrices() {

    this.pricesService
      .search({ page: 1, page_size : 100, order_by: 'created_at', order_by_dir: 'DESC' } as PricesSearchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(prices => {
        this.setLoading(false);
        
        this.prices = prices.results;
      })
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

  private lastDate: string = '';
  public isDateChanged(i: number) {
    if(i == 0) return true;

    let prevDate: Date = new Date(this.prices[i - 1].created_at);
    let date: Date = new Date(this.prices[i].created_at);

    let sPrevDate = prevDate.getFullYear() + '-' + (("0" + (prevDate.getMonth() + 1)).slice(-2)) + '-' + (("0" + prevDate.getDate()).slice(-2));
    let sDate = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));

    return sPrevDate != sDate;
  }

  getTotal(date: string) {
    let total: number = 0;

    this.prices.forEach(p => {
      if (this.datePipe.transform(p.created_at, this.dateFormat) == date) {
        total = parseFloat(total.toString()) + parseFloat(p.amount.toString());
      }
    })
    return total;
  }

  public dismissModal() {
    this.modalController.dismiss({
        'dismissed': true
    });
  }
}
