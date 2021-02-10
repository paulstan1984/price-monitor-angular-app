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
  public categorySelectorButtons: any[];

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

    this.loadMetaData();
  }

  ionViewDidEnter() {
    this.loadProducts(this.prodName);
  }

  loadMetaData(){
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

        this.categorySelectorButtons = [];
        this.categories.forEach(categ => {
          this.categorySelectorButtons.push({
            text: categ.name,
            icon: 'folder-outline',
            handler: () => {
              this.saveProduct(categ);
            }
          })
        });

        this.categorySelectorButtons.push({
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        });
      });
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
        this.products.forEach(p => {
          if(this.isInShoppingList(p)){
            p.Checked = true;
          }
        });
      })
  }

  searchProducts(event: any) {
    let prodName = event.detail.value;
    this.loadProducts(prodName);
  }

  updateCurrentStore(event: any) {
    this.setCurrentStore(event.detail.value);
  }

  addProduct(name: string) {

    this.selectCategoryActionSheet();
  }

  saveProduct(c: Category) {

    let prod: Product = {
      name: this.prodName,
      category_id: c.id
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
      buttons: this.categorySelectorButtons
    });
    await actionSheet.present();
  }

  public SaveToList(checked: boolean, p: Product) {
    if(checked) {
      this.addToShoppingList(p);
    } else {
      this.removeFromShoppingList(p);
    }
  }
}
