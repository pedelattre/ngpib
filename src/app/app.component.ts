import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

  title = 'PIB POC';

  constructor(private translate : TranslateService) {
      translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('fr');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }

  ngOnInit(): void {}
}
