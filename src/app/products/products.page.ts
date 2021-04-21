import { Component, Injector } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductsSearchRequest } from '../models/ProductsSearchRequest';
import { Store } from '../models/Store';
import { CategoriesService } from '../services/Categories.service';
import { ProductsService } from '../services/Products.service';
import { StoresService } from '../services/Stores.service';
import { BuyProduct } from './buyproduct.page';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage extends BaseComponent {

  public stores: Store[];
  public categories: Category[];
  public products: Product[];
  public prodName: string;
  public categorySelectorButtons: any[];

  constructor(
    injector:Injector,
    private storesService: StoresService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {
    super(injector);

    this.storesService.setAuthToken(this.getAuthToken());
    this.categoriesService.setAuthToken(this.getAuthToken());
    this.productsService.setAuthToken(this.getAuthToken());

    this.loadMetaData();
  }

  ionViewDidEnter() {
    this.loadProducts(this.prodName);
    this.selectedStore = parseInt(this.getCurrentStore());
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

  async buyPopup(prod: Product) {
    const modal = await this.modalController.create({
      component: BuyProduct,
      cssClass: 'my-custom-class',
      componentProps: {
        product: prod
      }
    });
    return await modal.present();
  }
}
