import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListPage } from './shopping-list.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ShoppingListRoutingModule
  ],
  declarations: [ShoppingListPage]
})
export class ShoppingListModule {}
