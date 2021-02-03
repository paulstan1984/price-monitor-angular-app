import { Component } from '@angular/core';
import { BaseComponent } from '../BaseComponent';
import { ShoppingList } from '../models/ShoppingList';

@Component({
  selector: 'app-shopping-list',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss']
})
export class ShoppingListPage  extends BaseComponent {

  shoppingList: ShoppingList | undefined;
  showSelected = false;

  constructor() { 
    super();

    this.shoppingList = this.getShoppingList();
    this.showSelected = this.getShowSelected();
  }

  toggleShowSelected(event: any){
    this.setShowSelected(event.detail.checked);
  }
}
