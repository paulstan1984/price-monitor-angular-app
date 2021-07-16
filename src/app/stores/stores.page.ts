import { Component, Injector } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Store } from '../models/Store';
import { StoresService } from '../services/Stores.service';
import { EditstoreComponent } from './editstore/editstore.component';

@Component({
  selector: 'app-stores',
  templateUrl: 'stores.page.html',
  styleUrls: ['stores.page.scss']
})
export class StoresPage extends BaseComponent {

  public stores: Store[];
  public storeName: string;

  constructor(
    injector:Injector,
    private storesService: StoresService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    super(injector);
  }

  ionViewDidEnter() {
    this.storesService.setAuthToken(this.getAuthToken());

    this.loadMetaData();

    this.selectedStore = parseInt(this.getCurrentStore());
  }

  loadMetaData() {
    this.loadStores();
  }

  loadStores(storeName: string = undefined) {
    this.storesService
      .search(storeName, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.stores = response.results;
      })
  }

  public addStore() {
    this.storesService.save({ name: this.storeName } as Store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.setLoading(false);
        this.loadStores();
        this.storeName = undefined;
        this.toastController.create({
            message: 'Store added.',
            duration: 2000
        }).then(t => t.present());
      })
  }

  async edit(item:Store) {
    const modal = await this.modalController.create({
      component: EditstoreComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        item: item,
        callback: () => {
          this.loadStores();
        }
      }
    });
    return await modal.present();
  }

  searchStores(event: any) {
    let storeName = event.detail.value;
    this.loadStores(storeName);
  }
}
