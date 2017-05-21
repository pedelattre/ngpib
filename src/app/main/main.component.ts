import { RouterModule, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';
import { CustomerService } from '../_services/customer.service';
import { Customer } from '../_models/Customer';
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
  params = {
    value1 : '',
    value2 : ''
  };

  constructor( private translate: TranslateService, private customerService: CustomerService) {}

  ngOnInit() {
    this.customer = this.customerService.getCustomerDetails(this.customerService.getCurrentCustomer().customerId);
    this.params.value1 = new DatePipe(this.translate.currentLang).transform(this.customer.lastLogon, 'dd/MM/yyyy');
    this.params.value2 = new DatePipe(this.translate.currentLang).transform(this.customer.lastLogon, 'HH:mm:ss');

    this.customerService.getCustomers().subscribe(result => {
        this.customers = result;
        console.log(result);
    });

    }

  print() {
    console.debug('Printing TODO...')
  }

}
