import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';
import { Store } from '../models/Store';
import { StoresService } from '../services/Stores.service';


export interface ErrorObject {
  GlobalMessage: string;
  DetailedMessages: any;
} 

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage extends BaseComponent {

  public stores: Store[];
  
  constructor(private storesService: StoresService) { 
    super();

    this.storesService.setAuthToken(environment.AuthToken);
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
}
