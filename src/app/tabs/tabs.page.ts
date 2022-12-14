import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { ShoppingList } from '../models/ShoppingList';
import { PricesService } from '../services/Prices.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BaseComponent {

  constructor(
    injector:Injector,
    private alertController: AlertController,
    private priceService: PricesService,
    private router: Router,
    private menuController: MenuController) {
    super(injector);

    this.priceService.setAuthToken(this.getAuthToken());
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
      this.priceService.buy(prices, () => this.setLoading(true), () => this.setLoading(false), error => {
          this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Error',
            message: error.message,
            buttons: ['Ok']
          }).then(w => w.present());
          this.errorHandler(error);
        })
        .subscribe(_ => {
          this.setLoading(false);
          this.setShoppingList({ items: [] } as ShoppingList);

          this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Products purchased!',
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.router.navigate(['tabs/products']);
              }
            }]
          }).then(a => a.present());

        })
    } else {
      this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Select at least a product?',
        buttons: ['Ok']
      }).then(w => w.present());
    }
  }

  openMenu() {  
    this.menuController.open('first');
  }
}
