import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  public Exit() {
    if(confirm('Exit?')){
      App.exitApp();
    }
  }
}
