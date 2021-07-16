import { Component, Injector, Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Price } from '../models/Price';
import { Product } from '../models/Product';
import { Store } from '../models/Store';
import { PricesService } from '../services/Prices.service';

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

    constructor(
        injector: Injector,
        private alertController: AlertController,
        private priceService: PricesService,
        public modalController: ModalController,
        public toastController: ToastController
    ) {
        super(injector);
        this.priceService.setAuthToken(this.getAuthToken());
    }

    public dismissModal() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    buy() {
        let prices = [{
            product_id: this.product.id,
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

                this.toastController.create({
                    message: 'Product purchased.',
                    duration: 2000
                }).then(t => t.present());
            })
    }
}
