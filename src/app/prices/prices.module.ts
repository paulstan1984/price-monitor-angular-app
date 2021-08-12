import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricesRoutingModule } from './prices-routing.module';
import { PricesComponent } from './prices.component';
import { TotalPricesByCategComponent } from './totalpricesbycateg.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PricesRoutingModule,
    NgxChartsModule
  ],
  declarations: [PricesComponent, TotalPricesByCategComponent],
  providers: [DatePipe]
})
export class PricesModule {}
