import { Component, Injector, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalComponent } from 'src/app/ModalComponent';
import { Category } from 'src/app/models/Category';
import { CategoriesService } from 'src/app/services/Categories.service';

@Component({
    selector: 'app-editcategory',
    templateUrl: './editcategory.component.html',
    styleUrls: ['./editcategory.component.scss']
})
export class EditcategoryComponent extends ModalComponent {

    @Input()
    public item: Category;

    @Input()
    public callback: Function;

    constructor(
        injector: Injector,
        private categoryService: CategoriesService,
        modalController: ModalController,
        private alertController: AlertController,
    ) {
        super(injector, modalController);
        this.categoryService.setAuthToken(this.getAuthToken());
    }

    submit() {
        this.categoryService.save(this.item, () => this.setLoading(true), () => this.setLoading(false), error => {
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
