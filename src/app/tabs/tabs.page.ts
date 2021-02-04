import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private alertController: AlertController) {}

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
}
