import { Component, Injector, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { PricesSearchRequest } from '../models/PricesSearchRequest';
import { PricesService } from '../services/Prices.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent extends BaseComponent {

  public prices: Price[];

  constructor(
    injector:Injector,
    private pricesService: PricesService,
    private alertController: AlertController
  ) {
    super(injector);

    this.pricesService.setAuthToken(this.getAuthToken());

    this.loadMetaData();
  }

  ionViewDidEnter() {
    this.loadPrices();
  }

  public loadMetaData() {
    this.loadPrices();
  }

  loadPrices() {
    this.pricesService
      .search({page: 1, order_by:'created_at', order_by_dir: 'DESC'} as PricesSearchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(prices => {
        this.setLoading(false);
        this.prices = prices.results;
      })
  }

  async delete(item:Price) {
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
}
