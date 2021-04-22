import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsComponent } from './statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StatisticsRoutingModule
  ],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
