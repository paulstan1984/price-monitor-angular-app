import { Component, Injector, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../BaseComponent';
import { AuthService } from '../services/Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private authService: AuthService,
    private router: Router
  ) { 
    super(injector);
  }

  password: string = '';
  username: string = '';
  year: number = 0;

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  public DoLogin(f: NgForm) {

    if (!this.validateForm(f)) {
      return;
    }

    this.authService
      .login(this.username, this.password, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.setAuthToken(response.token);
        this.router.navigate(['tabs/products']);
      })
  }
}
