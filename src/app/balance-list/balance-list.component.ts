import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Transaction } from 'app/models/Transaction';
import { Balance } from 'app/models/Balance';
import { Customer } from 'app/models/Customer';


import { TranslateService } from 'ng2-translate';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss']
})
export class BalanceListComponent implements OnInit {
 currentCustomer: Customer;
 loadingIndicator: boolean = true;

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
     let balanceId = balance ? balance.accountId : null;
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
