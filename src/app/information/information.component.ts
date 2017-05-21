import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  alertIsVisible: Boolean = true;
  displayAlertMessage: String = '';
  constructor(private translate: TranslateService) { }

  ngOnInit() {
        this.translate.get('MAIN.HID_ALERT').subscribe((res: string) => {
            this.displayAlertMessage = res;
        });
  }

  toggleAlert() {
    this.alertIsVisible = !this.alertIsVisible;
    if (this.alertIsVisible) {
      this.translate.get('MAIN.HID_ALERT').subscribe((res: string) => {
          this.displayAlertMessage = res;
      });
    } else {
      this.translate.get('MAIN.DSP_ALERT').subscribe((res: string) => {
          this.displayAlertMessage = res;
      });
    }

  }

}
