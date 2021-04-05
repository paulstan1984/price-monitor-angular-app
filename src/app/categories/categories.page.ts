import { Component, Injector } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseComponent } from '../BaseComponent';
import { Category } from '../models/Category';
import { Store } from '../models/Store';
import { CategoriesService } from '../services/Categories.service';

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
    private alertController: AlertController
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
}
