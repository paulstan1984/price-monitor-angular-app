import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShoppingList } from "./models/ShoppingList";

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

  dateTimeFormal = 'YYYY-MM-dd HH:mm:ss';

  errorHandler(error: HttpErrorResponse) {
    switch (error.status) {

      case 400:
      case 404:
        for (const field in error.error) {
          this.errorObj.DetailedMessages[field] = error.error[field];
        }
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
  getCurrentStore(){
    return localStorage.getItem(this.store_id);
  }
  setCurrentStore(store_id: number){
    return localStorage.setItem(this.store_id, store_id.toString());
  }

  shopping_list = 'shopping_list';
  getShoppingList() : ShoppingList{
    return JSON.parse(localStorage.getItem(this.shopping_list)) as ShoppingList;
  }
  setShoppingList(list: ShoppingList){
    localStorage.setItem(this.shopping_list, JSON.stringify(list));
  }

  show_selected = 'show_selected';
  getShowSelected() {
    return localStorage.getItem(this.show_selected) == 'true';
  }

  setShowSelected(value: boolean) {
    return localStorage.setItem(this.show_selected, value ? 'true': 'false');
  }
}