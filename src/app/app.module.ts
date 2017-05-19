import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';

// BootStrap Modules
import { AlertModule } from 'ng2-bootstrap';
import { TranslateModule, TranslateService } from 'ng2-translate';

// import { ShareModuleModule } from './share-module/share-module.module';

import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { VamMainComponent } from './vam-main/vam-main.component';
import { ContactBarComponent } from './contact-bar/contact-bar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BranchLocatorComponent } from './branch-locator/branch-locator.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { BalanceListComponent } from './balance-list/balance-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsComponent } from './products/products.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { TransfertComponent } from './transfert/transfert.component';

import { CustomerService } from './customer.service';
import { TransactionsService } from './transactions.service';

const appRoutes: Routes = [
  { path: 'dashboard', component: MainComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'histo', component: TransactionListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  { path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    CookieBannerComponent,
    VamMainComponent,
    ContactBarComponent,
    NavbarComponent,
    BranchLocatorComponent,
    TransactionListComponent,
    BalanceListComponent,
    PageNotFoundComponent,
    ProductsComponent,
    HelpComponent,
    LoginComponent,
    LogoutComponent,
    TransfertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, JsonpModule,
    RouterModule.forRoot(appRoutes),
    AlertModule.forRoot(),
    TranslateModule.forRoot()
  ],
  providers: [ 
    {provide: APP_BASE_HREF, useValue : '/' },
    CustomerService, TransactionsService ],
  bootstrap: [AppComponent]
})
export class AppModule {

constructor(private translate: TranslateService) {
        translate.addLangs(['fr', 'en']);
        translate.setDefaultLang('fr');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
        // translate.use('fr');
    }

 }
