import { Component, Injector } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { StatisticsRequest, StatisticsValue } from '../models/StatisticsRequest';
import { PricesComponent } from '../prices/prices.component';
import { StatisticsService } from '../services/statistics.service';


enum ChartTypes {
  Pie = 'Pie',
  Bar = 'Bar'
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent extends BaseComponent {

  cart_width = 400;
  cart_height = 500;
  statisticsRequest: StatisticsRequest;
  ChartTypes = ChartTypes;
  chartType: ChartTypes = ChartTypes.Bar;

  constructor(
    injector: Injector,
    public platform: Platform,
    public statisticsService: StatisticsService,
    public modalController: ModalController
  ) {
    super(injector);

    this.statisticsService.setAuthToken(this.getAuthToken());
  }

  series: StatisticsValue[];

  ngOnInit() {
    this.cart_width = this.platform.width();
    this.cart_height = this.platform.height() - 350;

    let today = new Date();
    let StartDate = new Date();

    if (today.getMonth() - 4 >= 0) {
      StartDate.setMonth(today.getMonth() - 4);
    } else {
      StartDate.setMonth(12 - (today.getMonth() - 4));
      StartDate.setFullYear(StartDate.getFullYear() - 1);
    }

    this.statisticsRequest = {
      GrouppingType: 'day',
      StartDate: StartDate.getFullYear() + '-' + (("0" + (StartDate.getMonth() + 1)).slice(-2)) + '-01',
      EndDate: today.getFullYear() + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + (("0" + today.getDate()).slice(-2))
    } as StatisticsRequest;

    this.DoFilter();
  }

  DoFilter() {

    this.statisticsService.getStatistics(this.statisticsRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        if (this.statisticsRequest.GrouppingType != 'none') {
          response.forEach(r => {
            r.series.forEach(s => s.name = new Date(s.name));
          })
        }
        this.setLoading(false);
        this.series = response[0].series;

        if (this.statisticsRequest.GrouppingType == 'day') {
          this.series = this.series.slice(Math.max(0, this.series.length - 10), this.series.length);
        }
      });
  }

  chartClick(e: any) {
    console.log(e);
    let date = e.name;
    let formattedDate = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));

    if(this.statisticsRequest.GrouppingType == 'month'){
      formattedDate = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2));
    }

    this.modalController.create({
      component: PricesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        date: formattedDate,
        preloaded: true,
        totalAmount: e.value
      }
    }).then(w => w.present());
  }
}
