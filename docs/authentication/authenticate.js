'use strict';
var chalk = require('chalk');
var request = require('request-promise');
//require('request-debug')(request); // allows to trace each request and redirect on the console
//var cheerio = require('cheerio');

// ------------------------------------------------------------------------------------------
// Customer PIB Session Global
var menus = "";
var params = "";
var sessionPath = "";
var icc = "";
var customerInfo = "";

// Few functions ----------------------------------------------------------------------------
function showError(errorTab) {
    var tempErrorStr = "";
    for(var i=0;i<errorTab.length;i++){
        tempErrorStr += errorTab[i].desc;
    }
    console.log(chalk.red(tempErrorStr));
}

function getAction(params, actionName) {
    var action = "";
    for (var i=0; i<params.length;i++) {
            if (params[i]["serviceId"] === actionName) {
                action = params[i].serviceParam;
            }
        }
    return action;
}

var messages = {
  "noService" : "Ma banque mobile est temporairement indisponible. Essayez à nouveau ultérieurement ou contactez-nous.",
  "C000" : "It will forced you logoff",
  "C001" : "Vous avez été inactif pendant un certain temps. Afin de protéger vos données, vous avez été automatiquement déconnecté. Merci de vous connecter à nouveau." ,
  "C003" : "Cette étape est obligatoire.",
  "C005" : "Vous devez enregistrer votre HSBC Secure Key Mobile pour accéder à cette fonctionnalité.<br/>Vous pouvez enregistrer votre HSBC Secure Key Mobile selon 2 façons:<br/>Vous pouvez utiliser l'activation en ligne après vous être connecté.<br/>Vous pouvez contacter le Centre de Relations Clients pour enregistrer votre HSBC Secure Key Mobile.<br/>Si vous n'avez pas reçu HSBC Secure Key 30 jours après votre choix, veuillez contacter rapidement le Centre de Relations Clients.",
  "C009" : "Activation CAM40 (attente de token) en cours",
  "E000" : "Erreur de connexion. Merci d'essayer à nouveau ultérieurement.",
  "P001" : "Nous avons rencontré un problème. Merci de vous connecter à nouveau.",
  "P002" : "Nous avons rencontré un problème. Merci de vous connecter à nouveau.",
  "P003" : "Le service n'est pas disponible. Merci d'essayer à nouveau ultérieurement.",
  "P004" : "Une erreur est survenue lors de l'accès à Ma banque Mobile. Merci de vérifier votre connexion à internet ou de vous reconnecter plus tard.",
  "jsonErr":"Ma banque mobile est temporairement indisponible. Merci de vous connecter à nouveau ou contactez-nous.",
  "headerErr":"Ma banque mobile est temporairement indisponible. Merci de vous connecter à nouveau ou contactez-nous.",
  "statusCodeErr":"Ma banque mobile est temporairement indisponible. Merci de vous connecter à nouveau ou contactez-nous."
}

// ------------------------------------------------------------------------------------------------------------------------
// Configure request
const PROXY_USER='your user';
const PROXY_PASS='your password';

var r = request
    .defaults({
        strictSSL: false, // test environment uses invalid ssl certificates
        followAllRedirects: true,
        json: true,
        //resolveWithFullResponse: true,
        jar: true, // takes set-cookies into account
        header : {
            'Accept-Language':'en-US,en;q=0.8,fr-FR;q=0.6,fr;q=0.4',
            'Accept':'*/*',
            'Accept-Encoding':'application/x-www-form-urlencoded',
            'DNT':'1',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrom/45.0.2454.101 Safari/537.36'
        },
        //proxy:'http://'+ PROXY_USER +':' + PROXY_PASS + '@uk-proxy-01.systems.uk.hsbc' // if required to exit corporate network
    });

// Globals
// ----------------------------------------------------------------------

// PWS (Authentication system using IDnV)
const sdehost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk'; //OAT
//const sdehost = "dtest-evrgrn-friif.lp.hsbc.co.uk"; // LP
//const sdehost = "www.hsbc.fr"; // PROD

// PIB (Personal Internet Banking)
const pibhost = 'client.oat2.hsbc.fr'; // OAT
//const pibhost = "client.hsbc.fr"; // PROD
//const pibhost = "d3njlp2u3e5oqv.cloudfront.net"; // OAT AWS
//const pibhost = "d50mfkke5itw7.cloudfront.net"; // PROD AWS
//const pibhost = "api.clients.hsbc.fr"; // PROD AWS
//const pibhost = "sylp.client.hsbc.fr"; // LP

var user = {
    //id: '02100157235', // Business card only holder (carambar, chomeur)
    //id: '02930007827', // standard user (carambar, platini)
    //id: '01724387351', // private bank user (carambar, chomeur)
    //DOUTEUX id: '01010097250', // Normal user (carambar, chomeur)
    //id: '33730489975', // Vincent account
    id: '01020029276', // Normal user (carambar, platini)
    
    password: "carambar",
    memorableAnswer: "platini",
    rccDigits: []
};
var locale = "fr";

// ########################################################################
// First Post to Authentication (user id is verified)
r.post('https://' + sdehost + '/1/2/',
    {
        form: {
            idv_cmd: "idv.Authentication",
            initialAccess: true,
            nextPage: "IDV_CAM10_AUTHENTICATION_MOBILE",
            userid: user.id,
            cookieuserid: false,
            ver: "1.1",
            json: "",
            __locale: locale,
            CHANNEL: "MOBILE"
        }
    }
// _________________________________________________________________
// First Response from the Authentication layer,
// get back the RCC pattern sent back by the server
).then(function (reply) {
    console.log(chalk.blue("## CAM10 response ", JSON.stringify(reply,null,'  ')));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log(chalk.red("error status ", reply.header.statusCode));
         showError(reply.header.errorMsg)
         return Promise.reject(reply);
    }
    user.rccDigits = reply.body.rccDigits.split(',').map(function (c) {return parseInt(c) });

    //
    // Open Mobile Authentication
    return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30');

// _________________________________________________________________
// Then wait for previous GET on TEST_MOBILE_CAM30
}).then(function(reply) {
    console.info(chalk.blue("## CAM20 response ", JSON.stringify(reply,null,'  ')));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.error(chalk.red("error status ", reply.header.statusCode));
         showError(reply.header.errorMsg)
         return Promise.reject(reply);
    }

    //var rccPassword = user.rccDigits.map(function (d) {return user.password.charAt(d-1);}).join('');
    var rccPassword = user.rccDigits.map(function (d){
        return user.password.charAt(d < 7 ? d - 1: user.password.length - 1 - (8 - d));
    }).join('');
    console.log(chalk.magenta('Authenticating rccPassword=', rccPassword, 'memAnswer=',user.memorableAnswer));

    return r.post('https://'+sdehost+'/1/2/',
        {
            form: {
                "idv_cmd": "idv.Authentication",
                "ver": "1.1",
                "json": "",
                "__FMNUserId": user.id,
                "memorableAnswer": user.memorableAnswer,
                "password": rccPassword,
                "__locale": locale
            }
        }
    );
// _________________________________________________________________
// Then wait for the CAM30 response
}).then(function(reply) {
    console.info(chalk.blue("## CAM30 response ", JSON.stringify(reply,null,'  ')));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.error(chalk.red("Serious error status ", reply.header.statusCode));
        showError(reply.header.errorMsg)
        return Promise.reject(reply);
    }
    if (reply.header && reply.header.statusCode && 'C005' == reply.header.statusCode) {
        console.log(chalk.red("Authentication ERROR: HardToken command expired"));
        showError(reply.header.errorMsg)
        return Promise.reject(reply);

    }
    console.log(chalk.white.bgGreen.bold('Authentication SUCCESSFUL (not deferred)'));

    // Post to mobile-localsso command
    return r.post("https://" + sdehost + "/1/3/authentication/mobile-localsso", {
        form: {
            "ver": "1.1",
            "json": ""
        }
    });
})
// _________________________________________________________________
// Then wait for the POST CAM30 response : get localSSO

.then(function(reply) {
    console.log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        showError(reply.header.errorMsg)
        return Promise.reject(reply);
    }

    console.log(chalk.white.bgGreen.bold('Get LocalSSO OK'));

    // get Customer information and localSSO
    customerInfo = reply.body;

    /*
    Typicall response :
    "statusMessage": "Last logon successful on",
    "customerName": "LUGINA",
    "ssoToken": "20093d9c44a289b2775c4cb63e5a0d9c1b6b6b2ac2712c102db52990c1d76188ef0ac41a3c57012527d80da4995ba2ed0b87e1faadc9981ddf3a5e474cece485b2a15e534e015bde616e764efa1d9b51d7a93910d29a3ef0e1f341359b4274df09cd6c843f5cbe50157c7eae7eba85b429b9810c8998f1f99e5ad3b4c9028202",
    "lastLogonDate": "30/05/2017 17:52:39",
    "isISFSupported": false,
    "lastLogonStatus": true
    */

    // Next : entitlement WEBACC mob (parametre)
    return r.get("https://" + pibhost + "/cgi-bin/emmob?Appl=WEBACC&Mob="+customerInfo.ssoToken)
})
// _________________________________________________________________
// Then wait the next response back from WEBACC
.then(function(reply) {
    console.log("Entitlement response ", JSON.stringify(reply, null, '  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        showError(reply.header.errorMsg)
        return Promise.reject(reply);
    }

    console.log(chalk.white.bgGreen.bold('Entitlement (from the PIB) OK'));

    // Process data from entitlement and keep it
    menus = reply.body.serviceIds;
    params = reply.body.serviceParams;
    sessionPath = reply.body.sessionPath;

    var balanceLink = getAction(params,"beneficiaries_management");
    var request="https://" + pibhost + "/cgi-bin/" + sessionPath + "?" +balanceLink;

    console.log(chalk.magenta("POST:" + request));
    return r.post(request, {
        form: {
            "locale":locale,
            "ver":"1.1",
            "json":"true"
            }
    });
})

// _________________________________________________________________
// Then wait the next response back (balances for instance)
.then(function(reply) {
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    // Process the response from entitlement
    // TODO : do it lazy !
    console.log(chalk.white.bgGreen.bold('Get customer context (from the PIB) OK'));
    console.log(chalk.white.bgBlue(reply));

    // CAll for logout
    var logoffLink = getAction(params, "logoff");
    var request = "https://" + pibhost + "/cgi-bin/"+ sessionPath + "?" + logoffLink;
    console.log(chalk.magenta("POST:" + request));
    return r.post(request, {
            form: {
                "locale":locale,
                "ver":"1.1",
                "json":"true"
                }
        });
    })
//
// _________________________________________________________________
// Logoff IDnV
.then(function(reply) {
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    console.log(chalk.white.bgGreen.bold('Logoff (from the PIB) OK'));
    console.log(JSON.stringify(reply));

    // CAll for logoff IdnV
    var request = "https://" + sdehost + "/1/3/?idv_cmd=idv.Logoff&nextPage=hbfr.mobile15.system-maintenance";
    console.log(chalk.magenta("POST:" + request));
    // Post to mobile-localsso command
    return r.post(request, {
        form: {
            "ver": "1.1",
            "json": ""
        }
    });
})
//
// _________________________________________________________________
// Logoff IDnV
.then(function(reply) {
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    console.log(chalk.white.bgGreen.bold('Logoff (from IDnV) OK'));
    console.log(JSON.stringify(reply));
    // Final
    return Promise.resolve(reply);
})
//
// _________________________________________________________________
// Catch on error (any)
.catch(function(reply) {
    if (reply) {
        console.error(chalk.red("ERROR : Unexpected error ", JSON.stringify(reply)));
    }
})
