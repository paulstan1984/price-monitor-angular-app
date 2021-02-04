import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BaseComponent {

  constructor(private alertController: AlertController) {
    super();
  }

  async Exit() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Exit?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          App.exitApp();
        }
      }, 'No']
    });

    alert.present();
  }

  async Buy() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Buy?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.BuyShoppingList();
        }
      }, 'No']
    });

    alert.present();
  }

  BuyShoppingList() {
    let list = this.getShoppingList();
    let store_id = parseInt(this.getCurrentStore());
    let prices = [];

    if (list && list.items && list.items.length > 0) {
      list.items.forEach(item => {
        let price = {
          product_id: item.product.id,
          store_id: store_id,
          amount: item.price
        } as Price;

        if (item.checked) {
          prices.push(price);
        }
      });
    }

    
  }
}
