import { Balance } from '../_models/Balance';
export const BALANCE_CC: Balance[] = [{
      accountId: '1',
      accountNumber: 'HBFR0909090909090',
      accountName: 'MR ANONYME',
      amount: -1234.56,
      valueDate: new Date(),
      accountType: 'CC',
      hasParent: false,
      currencyCode: 'EUR',
      currencyDesc: 'EUR',
      drCr: false,
      hyperLink: ''
},
{
      accountId: '1',
      accountNumber: 'HBFR080808080808',
      accountName: 'MR ANONYME',
      amount: 5643.21,
      valueDate: new Date(),
      accountType: 'CC',
      hasParent: false,
      currencyCode: 'EUR',
      currencyDesc: 'EUR',
      drCr: false,
      hyperLink: ''
}];

export const BALANCE_LN: Balance[] = [{
      accountId: '1',
      accountNumber: 'HBFR0234234234234',
      accountName: 'MR ANONYME',
      amount: 234234.2342,
      valueDate: new Date(),
      accountType: 'LN',
      hasParent: false,
      currencyCode: 'EUR',
      currencyDesc: 'EUR',
      drCr: false,
      hyperLink: ''
}];

export const BALANCE_PP: Balance[] = [{
      accountId: '1',
      accountNumber: 'HBFR0945645645645',
      accountName: 'MR ANONYME',
      amount: 123456.56,
      valueDate: new Date(),
      accountType: 'PP',
      hasParent: false,
      currencyCode: 'EUR',
      currencyDesc: 'EUR',
      drCr: false,
      hyperLink: ''
}];
