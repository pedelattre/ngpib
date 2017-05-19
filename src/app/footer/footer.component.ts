import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

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
