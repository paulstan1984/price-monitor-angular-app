import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoresPage } from './stores.page';
import { StoresRoutingModule } from './stores-routing.module';
import { EditstoreComponent } from './editstore/editstore.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StoresRoutingModule
  ],
  declarations: [StoresPage, EditstoreComponent]
})
export class StoresModule {}
