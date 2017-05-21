// {
// 						"desc": "COMPTE M. RONDEPIERRE EDOUARD",
// 						"hasParent": false,
// 						"accountNum": "00297551503.EUR",
// 						"ccy": {
// 							"desc": "EUR",
// 							"code": "EUR"
// 						},
// 						"type": "DD",
// 						"id": "CPTP",
// 						"accountDate": "",
// 						"balance": "4 594,13",
// 						"drCr": false,
// 						"sessionParam": "sessionid=C15D654D786BD3370FD235CD654C9A4BE63CB2A84F0535AC&Cpt=-1&posCptSel=0"
// 					}


/*
desc:accountName
hasParent:hasParent
accountNum:accountNumber
ccy.desc:currencyDesc
ccy.code:currencyCode
type:accountType
id:accountId
accountDate:valueDate
balance:amount
drCr:drCr
sessionParam:hyperLink

*/

export class Balance {
  accountNumber: String;
  accountName: String;
  accountType: String;
  accountId: String;
  amount: Number;
  hasParent: Boolean;
  valueDate: Date;
  currencyCode: String;
  currencyDesc: String;
  drCr: Boolean;
  hyperLink: String;
}
