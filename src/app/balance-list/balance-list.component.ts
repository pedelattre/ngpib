import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

import { Transaction } from 'app/_models/Transaction';
import { Balance } from 'app/_models/Balance';
import { Customer } from 'app/_models/Customer';

import { CustomerService } from '../_services/customer.service';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.css']
})
export class BalanceListComponent implements OnInit {
 currentCustomer: Customer;
 loadingIndicator = true;

//  columns = [
//     { name: 'Compte' },
//     { name: 'Number' },
//     { name: 'Solde' },
//     { name: 'Devise' }
//  ];

  // rows = [];
  balancesOfCC: Balance[];
  balancesOfPP: Balance[];
  balancesOfLN: Balance[];

  constructor(private translate: TranslateService,
              private customerService: CustomerService,
              private router: Router
              ) {}

  getHisto(balance: Balance) {
    console.log(balance);
     const balanceId = balance ? balance.accountId : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/histo']);
  }

  ngOnInit() {

    this.currentCustomer = this.customerService.getCurrentCustomer();
    this.balancesOfCC = this.customerService.getBalance(this.currentCustomer.customerId, 'CC');
    this.balancesOfPP = this.customerService.getBalance(this.currentCustomer.customerId, 'PP');
    this.balancesOfLN = this.customerService.getBalance(this.currentCustomer.customerId, 'LN');

    // this.rows = [{
    //       compte: 'MR RONDEPIERRE',
    //       number: 'HBFR0909090909090',
    //       solde: -1234.56,
    //       devise: 'EUR'
    // },
    // {
    //       compte: 'MR RONDEPIERRE',
    //       number: 'HBFR080808080808',
    //       solde: 5643.21,
    //       devise: 'EUR'
    // }];
//
    // this.loadingIndicator = false;

  }

}
