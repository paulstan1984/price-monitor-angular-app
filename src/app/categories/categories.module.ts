import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesPage } from './categories.page';
import { CategoriesRoutingModule } from './categories-routing.module';
import { EditcategoryComponent } from './editcategory/editcategory.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CategoriesRoutingModule
  ],
  declarations: [CategoriesPage, EditcategoryComponent]
})
export class CategoriesModule {}
