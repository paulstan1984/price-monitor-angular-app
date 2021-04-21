import { Component, Injector } from '@angular/core';
import { AlertController, ModalController, PickerController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { ShoppingList, ShoppingListItem } from '../models/ShoppingList';
import { PhotoService } from '../services/photo.service';
import { ShoppingListService } from '../services/ShoppingList.service';
import { Store } from '../models/Store';
import { StoresService } from '../services/Stores.service';
import { Product } from '../models/Product';
import { BuyProduct } from '../products/buyproduct.page';

const DEFNRDIGITS = 'DEFNRDIGITS';

@Component({
  selector: 'app-shopping-list',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss']
})
export class ShoppingListPage extends BaseComponent {

  shoppingList: ShoppingList | undefined;
  showSelected = false;
  defNrDigits: number;
  public stores: Store[];

  constructor(
    injector:Injector,
    private storesService: StoresService,
    private alertController: AlertController,
    private shoppingListService: ShoppingListService,
    private photoService: PhotoService,
    public modalController: ModalController) {
    super(injector);

    this.shoppingListService.setAuthToken(this.getAuthToken());
    this.storesService.setAuthToken(this.getAuthToken());

    this.loadStores();
    try {
      this.defNrDigits = parseInt(localStorage.getItem(DEFNRDIGITS));
      if (!this.defNrDigits) {
        this.defNrDigits = 2;
      }
    }
    catch (err) {
      this.defNrDigits = 2;
    }
  }


  ionViewDidEnter() {
    this.loadMetadata();
    this.selectedStore = parseInt(this.getCurrentStore());
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

  loadStores() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  changeCheck(item: ShoppingListItem) {
    if (item.checked && item.price > 0) {
      this.saveShoppingList();
    } else if (item.checked) {
      this.alertController.create({
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
                if (!this.isInShoppingList(item.product)) {
                  this.addToShoppingList(item.product);
                }
              });
              this.shoppingList = this.getShoppingList();

              this.showMessage('Sync list', 'The list was merged with the data from server!', this.alertController);
              this.setLoading(false);
            })
        }
      }, 'No']
    }).then(p => p.present());
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
    }).then(p => p.present());
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
    }).then(p => p.present());
  }

  getPrices() {
    this.photoService.newPhoto().then(photoData => {
      this.shoppingListService.recognizeImage(photoData, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(strings => {
          this.getListPrices(strings);
        })
    });
  }

  getListPrices(strings: string[]) {

    const request = { text_lines: strings, shopping_list: this.shoppingList };
    this.shoppingListService.getListPrices(request, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(list => {
        this.setShoppingList(list);
        this.shoppingList = this.getShoppingList();
      })
    this.setLoading(false);
  }

  getDigits() {

    let digits = [];
    for (let i = 0; i <= 9; i++) {
      let option = { text: i.toString(), value: i };
      digits.push(option);
    }

    return digits;
  }

  nrDigits(price) {

    if (price) {
      return (price * 100).toString().length;
    }
    else {
      return this.defNrDigits;
    }
  }

  getMultiply(nrDigits: number) {
    let retNum = 1;

    for (let i = 1; i < nrDigits; i++) {
      retNum *= 10;
    }
    return retNum;
  }

  get ShoppingListTotal(): number {
    let price = 0;
    if (this.shoppingList && this.shoppingList.items) {
      this.shoppingList.items.forEach(i => price += i.price);
    }
    return price;
  }

  async buyPopup(prod: Product) {
    const modal = await this.modalController.create({
      component: BuyProduct,
      cssClass: 'my-custom-class',
      componentProps: {
        product: prod,
        callback: () => {
          this.removeFromShoppingList(prod);
          this.loadMetadata();
        }
      }
    });
    return await modal.present();
  }
}
