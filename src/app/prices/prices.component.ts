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
  public modal: boolean = false;

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
    if(!this.modal) {
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
  public isDateChanged(d: string) {
    let newDate: boolean = false;
    if (this.lastDate == '' || this.lastDate != d) {
      newDate = true;
      this.lastDate = d;
    }

    return newDate;
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
