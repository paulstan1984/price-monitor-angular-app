import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';
import { Product } from '../models/Product';
import { ProductsSearchRequest } from '../models/ProductsSearchRequest';
import { Store } from '../models/Store';
import { ProductsService } from '../services/Products.service';
import { StoresService } from '../services/Stores.service';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage extends BaseComponent {

  public stores: Store[];
  public products: Product[];
  public selectedStore: number;
  public prodName: string;
  
  constructor(
    private storesService: StoresService,
    private productsService: ProductsService
  ) { 
    super();

    this.selectedStore = parseInt(this.getCurrentStore());
    this.storesService.setAuthToken(environment.AuthToken);
    this.productsService.setAuthToken(environment.AuthToken);
    this.loadStores();
    this.loadProducts('');
  }

  loadStores() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  loadProducts(prodName: string) {
    let searchRequest: ProductsSearchRequest = { 
      page: 1,
      name: prodName,
      order_by: 'name'
    } as ProductsSearchRequest;

    this.productsService
      .search(searchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(searchResponse => {
        this.setLoading(false);
        this.products = searchResponse.results;
      })
  }

  searchProducts(event: any) {
    let prodName = event.detail.value;
    this.loadProducts(prodName);
  }

  updateCurrentStore(event: any){
    this.setCurrentStore(event.detail.value);
  }

  addProduct(name: string) {
    let prod: Product = {
      name: name      
    } as Product;
    this.productsService.save(prod, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
    .subscribe(p => {
      this.loadProducts(p.name);
    })
  }
}
