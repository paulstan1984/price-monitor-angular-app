import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { ShoppingList } from '../models/ShoppingList';
import { PricesService } from '../services/Prices.service';
const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BaseComponent {

  constructor(
    private alertController: AlertController,
    private priceService: PricesService,
    private router: Router) {
    super();

    this.priceService.setAuthToken(environment.AuthToken);
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

    if (prices && prices.length) {
      this.priceService.buy(prices, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(_ => {
          this.setLoading(false);
          this.setShoppingList({ items: [] } as ShoppingList);
          this.router.navigate(['tabs/products']);
        })
    } else {
      const alert = this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Select at least a product?',
        buttons: [ 'Ok']
      }).then(w => w.present());
    }
  }
}
