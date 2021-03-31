import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoresPage } from './stores.page';
import { StoresRoutingModule } from './stores-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StoresRoutingModule
  ],
  declarations: [StoresPage]
})
export class StoresModule {}
