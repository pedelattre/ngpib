import { Component, OnInit } from '@angular/core';
import {Router}  from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
 
    constructor(
        private router: Router) { }
 
    ngOnInit() {
        // reset login status
        // this.authenticationService.logout();
 
        // get return url from route parameters or default to '/'
        // this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
    }
 
    login() {
      this.router.navigate(['/dashboard']);
        // this.loading = true;
        // this.authenticationService.login(this.model.username, this.model.password)
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}
