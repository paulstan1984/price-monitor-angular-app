import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { ShoppingList, ShoppingListItem } from '../models/ShoppingList';

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


  }

  ionViewDidEnter() {
    this.loadMetadata();
  }

  toggleShowSelected(event: any) {
    this.setShowSelected(event.detail.checked);
  }

  loadMetadata() {
    this.shoppingList = this.getShoppingList();
    this.showSelected = this.getShowSelected();
  }

  saveShoppingList() {
    this.setShoppingList(this.shoppingList);
  }

  changeCheck(item: ShoppingListItem) {
    console.log(item);
    if (item.checked && item.price > 0) {
      this.saveShoppingList();
    } else if (item.checked) {
      const alert = this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Please provide a price',
        inputs: [
          {
            name: 'price',
            type: 'number',
            placeholder: 'Price'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Ok',
            handler: (inputs) => {
              item.price = inputs.price;
              this.updateShoppingListItem(item);
            }
          }
        ]
      }).then(a => a.present());
    }
  }

  remove(item: ShoppingListItem) {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.removeFromShoppingList(item.product);
          this.loadMetadata();
        }
      }, 'No']
    }).then(a => a.present());
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
