import { Component, Injector } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Store } from '../models/Store';
import { StoresService } from '../services/Stores.service';

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
    private alertController: AlertController
  ) {
    super(injector);

    this.storesService.setAuthToken(this.getAuthToken());

    this.loadMetaData();
  }

  ionViewDidEnter() {
    this.loadStores();
    this.selectedStore = parseInt(this.getCurrentStore());
  }

  loadMetaData() {
    this.loadStores();
  }

  loadStores() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  public addStore() {
    this.storesService.save({ name: this.storeName } as Store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.setLoading(false);
        this.loadStores();
        this.storeName = undefined;
        this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Store Added!',
          buttons: [{
            text: 'Ok'
          }]
        }).then(a => a.present());
      })
  }
}
