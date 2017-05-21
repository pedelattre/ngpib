import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/guards.service';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { MainComponent } from './main/main.component';
import { LogoutComponent } from './logout/logout.component';
import { HelpComponent } from './help/help.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'help', component: HelpComponent },
    { path: '', component: HomeComponent, canActivate: [ AuthGuard ] },
    { path: 'dashboard', component: MainComponent, canActivate: [ AuthGuard ]  },
    { path: 'histo', component: TransactionListComponent, canActivate: [ AuthGuard ]  },
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
    { path: '**', component: PageNotFoundComponent },
    // otherwise redirect to home
    // { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
