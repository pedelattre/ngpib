import {Injectable, Inject} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Customer} from './models/Customer';
import {Transaction} from './models/Transaction';
import {Balance} from './models/Balance';

import { CUSTOMERS_URL } from './config';

// Mock objects
import {TRANSACTIONS} from './data/transactions';
import {CUSTOMER} from './data/customer';
import {BALANCE_CC, BALANCE_PP, BALANCE_LN} from './data/balances';

@Injectable()
export class CustomerService {

  // Constructor
  constructor(
    private http: Http
    ) {}


  /*
  getCustomerDetails
  */
  getCustomerDetails(userId: String) : Customer {

    console.debug('Getting customer details of customer : ' + userId);

    let customer: Customer;
    customer = CUSTOMER;
    return customer;
  }

  /*
  getCustomers
  */
  getCustomers(): Observable<Customer[]> {
    return this.http.get(CUSTOMERS_URL)
      .map((res: Response)  => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }


  /*
  getTransactions
  */
  // getTransactions(userId : String, accountNumber : String) : Transaction[] {
  //   let transactions : Transaction[];

  //   console.debug('Getting transactions of customer : ' + userId + ' for account ' + accountNumber);

  //   if (userId !== '' && accountNumber !== '') {
  //     transactions = TRANSACTIONS;
  //   };

  //   return transactions;
  // }

  /*
  getCurrentCustomer
  */

  getCurrentCustomer() : Customer {
    console.debug('Getting current customer.');
    return CUSTOMER;
  }

/*
getBalance
*/
  getBalance(userId : String, accountType : String) : Balance[] {
    console.debug('Getting balances for customer ' + userId + ' and for account type ' + accountType);

    let balance : Balance[];
    if (userId !== '') {
      if (accountType === 'CC') {
        balance = BALANCE_CC;
      } else if (accountType === 'PP') {
        balance = BALANCE_PP;
      } else if (accountType === 'LN') {
        balance = BALANCE_LN;
      };
    }
    return balance;
  }


}
