import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  constructor(private translate : TranslateService) {
      translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('fr');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
        
        
        console.log('Starting app...');
        console.log(this.translate);
        translate.get('HELLO', {value: 'world'}).subscribe((res: string) => {
          console.log(res);
          });
    }

  ngOnInit(): void {}
}
