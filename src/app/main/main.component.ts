import { RouterModule, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../models/Customer';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import {Observable} from 'rxjs/Rx';

/**
 * 
 * 
 * @export
 * @class MainComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  customers: Customer[];
  customer: Customer;
  alertIsVisible: boolean = true;
  params = {
    value1 : '',
    value2 : ''
  };
  displayAlertMessage = '';

  constructor( private translate: TranslateService, 
              private customerService: CustomerService) {}

  ngOnInit() {
    this.customer = this.customerService.getCustomerDetails(this.customerService.getCurrentCustomer().customerId);
    this.params.value1 = new DatePipe(this.translate.currentLang).transform(this.customer.lastLogon, 'dd/MM/yyyy');
    this.params.value2 = new DatePipe(this.translate.currentLang).transform(this.customer.lastLogon, 'HH:mm:ss');
    this.translate.get('MAIN.HID_ALERT').subscribe((res: string) => {
            this.displayAlertMessage = res;
        });

    this.customerService.getCustomers().subscribe(result => {
        this.customers = result;
        console.log(result);
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

  print() {
    console.debug('Printing TODO...')
  }

}
