import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-vam-main',
  templateUrl: './vam-main.component.html',
  styleUrls: ['./vam-main.component.scss']
})
export class VamMainComponent implements OnInit {

  visible: Boolean = true;

  close() {
    this.visible = false;
  }

  constructor() { }

  ngOnInit() {
  }

}