import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsComponent } from './statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StatisticsRoutingModule,
    NgxChartsModule
  ],
  declarations: [StatisticsComponent],
  providers: [DatePipe]
})
export class StatisticsModule {}
