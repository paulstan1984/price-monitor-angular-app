import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductsSearchRequest } from '../models/ProductsSearchRequest';
import { Store } from '../models/Store';
import { CategoriesService } from '../services/Categories.service';
import { ProductsService } from '../services/Products.service';
import { StoresService } from '../services/Stores.service';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage extends BaseComponent {

  public stores: Store[];
  public categories: Category[];
  public products: Product[];
  public selectedStore: number;
  public prodName: string;
  
  constructor(
    private storesService: StoresService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private actionSheetController: ActionSheetController
  ) { 
    super();

    this.selectedStore = parseInt(this.getCurrentStore());
    this.storesService.setAuthToken(environment.AuthToken);
    this.categoriesService.setAuthToken(environment.AuthToken);
    this.productsService.setAuthToken(environment.AuthToken);
    this.loadStores();
    this.loadCategories();
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

  loadCategories() {
    this.categoriesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(categories => {
        this.setLoading(false);
        this.categories = categories;
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

    //select category then add product
    this.selectCategoryActionSheet();

    let prod: Product = {
      name: name      
    } as Product;
    this.productsService.save(prod, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
    .subscribe(p => {
      this.loadProducts(p.name);
    })
  }


  async selectCategoryActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select the category',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
