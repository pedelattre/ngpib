import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Application services
import { AuthGuard } from './_guards/guards.service';
import { CustomerService } from './_services/customer.service';
import { TransactionsService } from './_services/transactions.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';

// FakeBackend
import {fakeBackendProvider} from './_helpers/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';


import { routing } from './app.routing';

import { AlertModule } from 'ng2-bootstrap';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { VamMainComponent } from './vam-main/vam-main.component';
import { ContactBarComponent } from './contact-bar/contact-bar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { BalanceListComponent } from './balance-list/balance-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { InformationComponent } from './information/information.component';
import { HomeComponent } from './home/home.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, '/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BalanceListComponent,
    ContactBarComponent,
    CookieBannerComponent,
    FooterComponent,
    HeaderComponent,
    HelpComponent,
    HomeComponent,
    InformationComponent,
    LoginComponent,
    LogoutComponent,
    MainComponent,
    NavbarComponent,
    PageNotFoundComponent,
    TransactionListComponent,
    VamMainComponent,
  ],
  imports: [
    routing,
    BrowserModule,
    TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
    FormsModule,
    HttpModule,
    JsonpModule,
    AlertModule.forRoot()
  ],
  providers: [ 
    {provide: APP_BASE_HREF, useValue : '/' },
    AuthGuard,
    CustomerService,
    TransactionsService,
    AuthenticationService,
    UserService,
    // BEWARE : fakeBAckend will intercept all HTTP request (translation won't work)
    //fakeBackendProvider,
    //MockBackend,
    //BaseRequestOptions
    ],
  bootstrap: [AppComponent]
})
export class AppModule {

constructor() {

    }

 }
