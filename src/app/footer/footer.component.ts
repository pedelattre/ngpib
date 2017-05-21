import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  params = { currentYear: ''};
  
  constructor ( private translate: TranslateService) {}

  ngOnInit() {
    this.params.currentYear = new Date().getFullYear().toString();
  }

}
