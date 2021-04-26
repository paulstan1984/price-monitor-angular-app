import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricesRoutingModule } from './prices-routing.module';
import { PricesComponent } from './prices.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PricesRoutingModule
  ],
  declarations: [PricesComponent],
  providers: [DatePipe]
})
export class PricesModule {}
