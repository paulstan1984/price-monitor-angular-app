import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsPage } from './products.page';
import { ProductsRoutingModule } from './products-routing.module';
import { BuyProduct } from './buyproduct.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProductsRoutingModule
  ],
  declarations: [ProductsPage, BuyProduct]
})
export class ProductsModule {}
