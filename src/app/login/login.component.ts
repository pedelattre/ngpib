import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';
import { TestUser } from '../_models/TestUser';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    //id: '02100157235', // Business card only holder (carambar, chomeur)<br />
    //id: '02930007827', // standard user (carambar, platini)<br />
    //id: '01724387351', // private bank user (carambar, chomeur)<br />
    //id: '01010097250', // Normal user (carambar, chomeur)<br />
    //id: '31564944768', // Normal user (carambar, platini)<br />
    //id: '01020029276', // Normal user (carambar, platini)<br />

     constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.memanswer, this.model.password)
            .subscribe(result => {
                if (result == true) {
                    // login successful
                    localStorage.setItem('currentUser','is falsly Connected ')
                    this.router.navigate(['dashboard']);
                } else {
                    // login failed
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}
