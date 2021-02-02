import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";

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
}