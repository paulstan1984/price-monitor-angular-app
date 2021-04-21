import { Component, Injector, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/ModalComponent';
import { Category } from 'src/app/models/Category';
import { Product } from 'src/app/models/Product';
import { CategoriesService } from 'src/app/services/Categories.service';
import { ProductsService } from 'src/app/services/Products.service';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditproductComponent extends ModalComponent {

  @Input()
  public item: Product;

  @Input()
  public callback: Function;

  categories: Category[];

  constructor(
      injector: Injector,
      private productsService: ProductsService,
      private categoriesService: CategoriesService,
      modalController: ModalController,
      private alertController: AlertController,
  ) {
      super(injector, modalController);
      this.productsService.setAuthToken(this.getAuthToken());
      this.categoriesService.setAuthToken(this.getAuthToken());

      this.categoriesService.list(() => this.setLoading(true), () => this.setLoading(false), this.errorHandler)
        .subscribe(categories => {
            this.setLoading(false);
            this.categories = categories;
        })
  }

  submit() {
      this.productsService.save(this.item, () => this.setLoading(true), () => this.setLoading(false), error => {
          this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: error.message,
              buttons: ['Ok']
          }).then(w => w.present());
          this.errorHandler(error);
      })
          .subscribe(_ => {
              this.setLoading(false);
              this.dismissModal();
          })
  }

}
