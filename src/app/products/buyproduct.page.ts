import { Component, Injector, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { Product } from '../models/Product';
import { Store } from '../models/Store';
import { PricesService } from '../services/Prices.service';
import { StoresService } from '../services/Stores.service';

@Component({
    selector: 'app-buyproduct',
    templateUrl: 'buyproduct.page.html',
    styleUrls: ['buyproduct.page.scss']
})
export class BuyProduct extends BaseComponent {

    @Input()
    public product: Product
    @Input()
    public callback: Function;

    public stores: Store[];

    constructor(
        injector:Injector,
        private storesService: StoresService,
        private alertController: AlertController,
        private priceService: PricesService,
        public modalController: ModalController
    ) {
        super(injector);

        this.storesService.setAuthToken(this.getAuthToken());
        this.priceService.setAuthToken(this.getAuthToken());

        this.loadStores();
    }

    loadStores() {
        this.storesService
            .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
            .subscribe(stores => {
                this.setLoading(false);
                this.stores = stores;
            })


        this.selectedStore = parseInt(this.getCurrentStore());
    }

    public dismissModal() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    buy() {
        let prices = [{
            product_id: this.product.id,
            store_id: this.selectedStore,
            amount: this.product.lastPrice
        } as Price];

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
                this.dismissModal();
                this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Product purchased!',
                    buttons: [{
                        text: 'Ok'
                    }]
                }).then(a => {
                    a.present();
                    if(this.callback) {
                        this.callback();
                    }
                });

            })
    }
}
