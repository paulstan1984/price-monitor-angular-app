import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { ShoppingList } from '../models/ShoppingList';

@Component({
  selector: 'app-shopping-list',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss']
})
export class ShoppingListPage extends BaseComponent {

  shoppingList: ShoppingList | undefined;
  showSelected = false;

  constructor(private alertController: AlertController) {
    super();

    this.ionViewWillEnter();
  }

  toggleShowSelected(event: any) {
    this.setShowSelected(event.detail.checked);
  }

  ionViewWillEnter() {
    this.shoppingList = this.getShoppingList();
    this.showSelected = this.getShowSelected();
  }

  async newList() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.shoppingList = { items: [] } as ShoppingList;
          this.setShoppingList(this.shoppingList);
        }
      }, 'No']
    });

    alert.present();
  }
}
