import { Component, Injector, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/ModalComponent';
import { Store } from 'src/app/models/Store';
import { StoresService } from 'src/app/services/Stores.service';

@Component({
  selector: 'app-editstore',
  templateUrl: './editstore.component.html',
  styleUrls: ['./editstore.component.scss']
})
export class EditstoreComponent extends ModalComponent {

  @Input()
  public item: Store;

  @Input()
  public callback: Function;

  constructor(
      injector: Injector,
      private storesService: StoresService,
      modalController: ModalController,
      private alertController: AlertController,
  ) {
      super(injector, modalController);
      this.storesService.setAuthToken(this.getAuthToken());
  }

  submit() {
      this.storesService.save(this.item, () => this.setLoading(true), () => this.setLoading(false), error => {
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
          })
  }

}
