import { Component, Injector, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { StatisticsValue } from '../models/StatisticsRequest';

@Component({
  selector: 'app-prices-by-categ',
  templateUrl: './totalpricesbycateg.component.html',
  styleUrls: []
})
export class TotalPricesByCategComponent extends BaseComponent {

  @Input()  
  categSeries: StatisticsValue[];

  cart_width = 400;
  cart_height = 500;

  constructor(
    injector: Injector,
    public modalController: ModalController
  ) {
    super(injector);
  }

  public dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
