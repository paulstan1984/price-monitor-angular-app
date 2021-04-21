import { Component, Injector } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
    private alertController: AlertController,
    public modalController: ModalController
  ) {
    super(injector);

    this.categoriesService.setAuthToken(this.getAuthToken());

    this.loadMetaData();
  }

  ionViewDidEnter() {
    this.loadCategories();
  }

  loadMetaData(){
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(categories => {
        this.setLoading(false);
        this.categories = categories;
      });
  }

  public addCategory() {
    this.categoriesService.save({ name: this.categoryName } as Store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.setLoading(false);
        this.loadCategories();
        this.categoryName = undefined;
        this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Category Added!',
          buttons: [{
            text: 'Ok'
          }]
        }).then(a => a.present());
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
}
