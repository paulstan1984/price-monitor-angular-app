import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';
import { ShoppingList, ShoppingListItem } from '../models/ShoppingList';
import { PhotoService } from '../services/photo.service';
import { ShoppingListService } from '../services/ShoppingList.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss']
})
export class ShoppingListPage extends BaseComponent {

  shoppingList: ShoppingList | undefined;
  showSelected = false;

  constructor(
    private alertController: AlertController,
    private shoppingListService: ShoppingListService,
    private photoService: PhotoService) {
    super();

    this.shoppingListService.setAuthToken(environment.AuthToken);
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
            cssClass: 'secondary',
            handler: () => {
              item.checked = false;
            }
          }, {
            text: 'Ok',
            handler: (inputs) => {
              if (inputs.price > 0) {
                item.price = inputs.price;
                this.updateShoppingListItem(item);
              }
              else {
                item.checked = false;
              }
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

  syncList() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sync?',
      message: 'Sync the shopping list.',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.shoppingListService.get(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
            .subscribe(list => {
              list.items.forEach(item => {
                if(!this.isInShoppingList(item.product)) {
                  this.addToShoppingList(item.product);
                }
              });
              this.shoppingList = this.getShoppingList();

              this.showMessage('Sync list', 'The list was merged with the data from server!', this.alertController);
              this.setLoading(false);
            })
        }
      }, 'No']
    }).then(p=>p.present());
  }

  pushList() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Push?',
      message: 'Push the shopping list.',
      buttons: [{
        text: 'Yes',
        handler: () => {
          let list = this.getShoppingList();
          this.shoppingListService.save(list, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
          .subscribe(() => {
            this.showMessage('Push list', 'The list was stored to server!', this.alertController);
            this.setLoading(false);
          })
        }
      }, 'No']
    }).then(p=>p.present());
  }

  popList() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Pop?',
      message: 'Pop the shopping list.',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.shoppingListService.get(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
          .subscribe(list => {
            this.setShoppingList(list);
            this.shoppingList = this.getShoppingList();
            this.showMessage('Pop list', 'The list was loaded from server!', this.alertController);
            this.setLoading(false);
          })
        }
      }, 'No']
    }).then(p=>p.present());
  }

  getPrices() {
    this.photoService.newPhoto().then(a => {
      this.shoppingListService.recognizeImage(a, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(strings => {
        console.log(strings);
        this.setLoading(false);
      })
    });
  }
}
