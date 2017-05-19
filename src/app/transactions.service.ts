import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class TransactionsService {
  URL: string = './app/data/transactions.json';
  constructor(private http: Http) { }

  getTransactions(): Observable<any> {
    // this.transactions = this.customerService.getTransactions(this.currentCustomer.customerId, '1234');
    return this.http.get(this.URL)
            // ...and calling .json() on the response to return data
              .map((res: Response) => res.json())
              //...errors if any
              .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
