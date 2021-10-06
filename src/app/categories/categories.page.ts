import { Component, Injector } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Category } from '../models/Category';
import { Store } from '../models/Store';
import { CategoriesService } from '../services/Categories.service';
import { EditcategoryComponent } from './editcategory/editcategory.component';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss']
})
export class CategoriesPage extends BaseComponent {

  public categories: Category[];
  public categoryName: string;

  constructor(
    injector: Injector,
    private categoriesService: CategoriesService,
    private toastController: ToastController,
    public modalController: ModalController
  ) {
    super(injector);
  }

  ionViewDidEnter() {
    this.categoriesService.setAuthToken(this.getAuthToken());

    this.loadMetaData();
  }

  loadMetaData(){
    this.loadCategories();
  }

  loadCategories(categoryName: string = undefined) {
    this.categoriesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(categories => {
        this.setLoading(false);
        this.categories = categories;
      });
  }

  public addCategory() {
    this.categoriesService.save({ name: this.categoryName } as Category, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.setLoading(false);
        this.loadCategories();
        this.categoryName = undefined;
        this.toastController.create({
          message: 'Category added.',
          duration: 2000
      }).then(t => t.present());
      })
  }

  async edit(item:Category) {
    const modal = await this.modalController.create({
      component: EditcategoryComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        item: item,
        callback: () => {
          this.loadCategories();
        }
      }
    });
    return await modal.present();
  }

  searchCategories(event: any) {
    let categoryName = event.detail.value;
    this.loadCategories(categoryName);
  }
}
