import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';
import { Transaction } from 'app/_models/Transaction';
import { Customer } from 'app/_models/Customer';

import { CustomerService } from '../_services/customer.service';
import { TransactionsService } from '../_services/transactions.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
    currentCustomer: Customer;
    errorMessage: string;
    result: any[];
    transactions: Transaction[];

    constructor(private customerService: CustomerService, private transactionsService: TransactionsService) {
      this.customerService = customerService;
      this.currentCustomer = this.customerService.getCurrentCustomer();
    }

    ngOnInit() {
      // this.transactions = this.customerService.getTransactions(this.currentCustomer.customerId, '1234');
      this.transactionsService.getTransactions().subscribe(
        transactions => this.transactions = transactions.body.histories,
        error =>  this.errorMessage = <any>error
      );

    }
  }
