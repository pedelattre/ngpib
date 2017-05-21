import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-contact-bar',
  templateUrl: './contact-bar.component.html',
  styleUrls: ['./contact-bar.component.scss']
})
export class ContactBarComponent implements OnInit {
  items = [];
  constructor() { }

  ngOnInit() {
    this.items.push({ value: 0, name: 'first contact' });
    this.items.push({ value: 0, name: 'second contact' });
    this.items.push({ value: 0, name: 'third contact' });
  }

}
