import { Injectable, Injector, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { BaseComponent } from "./BaseComponent";

@Injectable()
export class ModalComponent extends BaseComponent {

    @Input()
    public callback: Function

    constructor(injector: Injector, private modalController: ModalController) {
        super(injector);
    }

    public dismissModal() {
        this.modalController.dismiss({
            'dismissed': true
        });
        this.callback();
    }
}