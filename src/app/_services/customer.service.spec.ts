/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CustomerService } from './customer.service';
import { Customer } from '../_models/Customer';

import { CUSTOMERS_URL } from '../config';


describe('CustomerService', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
  
      providers: [
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backendInstance, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          CustomerService
          ]
    });
  });

  it('It should be instanciated (simple constructor test)', inject([CustomerService], (service: CustomerService) => {
    expect(service).toBeTruthy();
  }));

  it('It should return a not empty Customers list', inject([CustomerService], (service: CustomerService) => {
    let result: Customer[];
    service.getCustomers().subscribe(
      data => {
        this.result = data;
        expect(this.result.length).toBeGreaterThan(0);
        console.log(this.result);
      },
      error => {
        console.error(error);
      }
    );

  }));

});
