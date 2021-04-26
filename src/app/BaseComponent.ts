import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Product } from "./models/Product";
import { ShoppingList, ShoppingListItem } from "./models/ShoppingList";

export interface ErrorObject {
  GlobalMessage: string;
  DetailedMessages: any;
}

@Injectable()
export class BaseComponent {

  loading: boolean = false;
  errorObj: ErrorObject = {
    GlobalMessage: '',
    DetailedMessages: {}
  } as ErrorObject;

  public dateTimeFormal = 'YYYY-MM-dd HH:mm:ss';
  public dateFormat = 'yyyy-MM-dd';
  public selectedStore: number;

  constructor(private injector: Injector) {

  }

  errorHandler(error: HttpErrorResponse) {
    switch (error.status) {

      case 400:
      case 404:
        for (const field in error.error) {
          this.errorObj.DetailedMessages[field] = error.error[field];
        }
        break;

      case 403:
        this.injector.get(Router).navigate(['login']);
        break;

      case 500:
      default:
        this.errorObj.GlobalMessage = error.message;
        break;
    }
    throw error;
  }

  public validateForm(f: NgForm): boolean {
    let valid = true;

    for (const key in f.controls) {
      if (f.controls.hasOwnProperty(key)) {
        valid = valid && f.controls[key].valid;
        if (!f.controls[key].valid) {
          f.controls[key].markAsDirty();
        }
      }
    }

    return valid;
  };

  setLoading(loading: boolean) {
    this.loading = loading;

    if (loading) {
      this.errorObj = {
        GlobalMessage: '',
        DetailedMessages: {}
      } as ErrorObject;
    }
  }

  store_id = 'store_id';
  getCurrentStore(): string {
    return localStorage.getItem(this.store_id);
  }
  setCurrentStore(store_id: string) {
    return localStorage.setItem(this.store_id, store_id.toString());
  }

  shopping_list = 'shopping_list';
  getShoppingList(): ShoppingList {
    let strList = localStorage.getItem(this.shopping_list);

    if (!strList || strList == '') {
      return { items: [] } as ShoppingList;
    }

    return JSON.parse(localStorage.getItem(this.shopping_list)) as ShoppingList;
  }
  setShoppingList(list: ShoppingList) {
    localStorage.setItem(this.shopping_list, JSON.stringify(list));
  }
  isInShoppingList(p: Product) {
    let shoppingList = this.getShoppingList();

    for (let i = 0; i < shoppingList.items.length; i++) {
      if (shoppingList.items[i].product.id == p.id) {
        return true;
      }
    }

    return false;
  }
  addToShoppingList(p: Product) {

    if (this.isInShoppingList(p)) {
      return;
    }

    let list = this.getShoppingList();
    if (!list) {
      list = { items: [] } as ShoppingList;
    }

    list.items.push({
      product: p,
      checked: false,
      price: p.lastPrice
    } as ShoppingListItem);

    this.setShoppingList(list);
  }

  removeFromShoppingList(p: Product) {
    let list = this.getShoppingList();
    if (!list) {
      list = { items: [] } as ShoppingList;
    }

    let i = 0;
    while (i < list.items.length) {
      if (list.items[i].product.id == p.id) {
        list.items.splice(i, 1);
      } else {
        i++;
      }
    }

    this.setShoppingList(list);
  }

  updateShoppingListItem(item: ShoppingListItem) {
    let list = this.getShoppingList();
    if (!list) {
      list = { items: [] } as ShoppingList;
    }

    list.items.forEach(i => {
      if (i.product.id == item.product.id) {
        i.price = item.price;
      }
    });

    this.setShoppingList(list);
  }

  show_selected = 'show_selected';
  getShowSelected() {
    return localStorage.getItem(this.show_selected) == 'true';
  }

  setShowSelected(value: boolean) {
    return localStorage.setItem(this.show_selected, value ? 'true' : 'false');
  }

  showMessage(header: string, message: string, alertController: AlertController) {
    alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['Ok']
    }).then(a => a.present());
  }

  updateCurrentStore(event: any) {
    this.setCurrentStore(event.detail.value);
  }

  getAuthToken() {

    let token = localStorage.getItem('AuthToken');
    let router: Router = this.injector.get(Router);

    if (!token) {
      router.navigate(['login']);
    }

    return token;
  }

  setAuthToken(token: string) {
    localStorage.setItem('AuthToken', token);
  }
}