import { Component, Injector } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { StatisticsRequest, StatisticsValue } from '../models/StatisticsRequest';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent extends BaseComponent {

  cart_width = 400;
  cart_height = 500;
  statisticsRequest: StatisticsRequest;

  constructor(
    injector: Injector,
    public platform: Platform,
    public statisticsService: StatisticsService
  ) {
    super(injector);

    this.statisticsService.setAuthToken(this.getAuthToken());
  }

  series : StatisticsValue[];

  ngOnInit() {
    this.cart_width = this.platform.width();
    this.cart_height = this.platform.height() - 350;

    let today = new Date();
    this.statisticsRequest = {
      GrouppingType: 'day',
      StartDate: today.getFullYear() + '-' + (("0" + today.getMonth()).slice(-2)) + '-01',
      EndDate: today.getFullYear() + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + (("0" + today.getDate()).slice(-2))
    } as StatisticsRequest;
     
    this.DoFilter();
  }

  DoFilter() {
  
    this.statisticsService.getStatistics(this.statisticsRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        if(this.statisticsRequest.GrouppingType != 'none') {
          response.forEach(r => {
            r.series.forEach(s => s.name = new Date(s.name));
          })
        }
        this.setLoading(false);
        this.series = response[0].series;
      });
  }

}
