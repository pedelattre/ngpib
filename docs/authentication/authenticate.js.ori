'use strict';
var request = require('request-promise');
// allows to trace each request and redirect on the console
require('request-debug')(request);

var r = request
    .defaults({
        strictSSL: false, // test environment uses invalid ssl certificates
        followAllRedirects: true,
        json: true,
        jar: true // takes set-cookies into account
        //'proxy':'http://$pplsoft$:$password$@uk-proxy-01.systems.uk.hsbc' // if required to exit corporate network
    });

// Global Vars 
// ----------------------------------------------------------------------
// const sdehost = 'www.eu532.p2g.netd2.hk.hsbc';
const sdehost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk';
var user = {
    id: '02100157235', // Business card only holder
    // id: '00430011591', // standard user
    // id: '01724387351', // private bank user
    password: 'carambar',
    memorableAnswer: 'chomeur',
    rccDigits: []
};
var locale = 'fr';

// First Post to Authentication (user id is verified)
r.post('https://' + sdehost + '/1/2/',
    {
        form: {
            idv_cmd: "idv.Authentication",
            initialAccess: true,
            nextPage: "IDV_CAM10_AUTHENTICATION_MOBILE",
            userid: user.id,
            cookieuserid: '',
            ver: "1.1",
            json: "",
            __locale: locale
        }
    }
// First Response from the Authentication layer, 
// get back the RCC pattern sent back by the server
).then(function (reply) {
    console.log("CAM10 response ", JSON.stringify(reply,null,'  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    user.rccDigits = reply.body.rccDigits.split(',').map(function (c) {return parseInt(c) });
    return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30');
    
//
// Then wait for previous GET on TEST_MOBILE_CAM30
}).then(function(reply) {
    console.info("CAM20 response ", JSON.stringify(reply,null,'  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.error("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    var rccPassword = user.rccDigits.map(function (d) {return user.password.charAt(d-1);}).join('');
    console.log('authenticating rccPassword=', rccPassword, 'memAnswer=',user.memorableAnswer);
    return r.post('https://'+sdehost+'/1/2/',
        {
            form: {
                idv_cmd: "idv.Authentication",
                "ver": "1.1",
                "json": "",
                "__FMNUserId": user.id,
                "memorableAnswer": user.memorableAnswer,
                "password": rccPassword,
                "__locale": locale
            }
        }
    );
// Then wait for the CAM30 response
}).then(function(reply) {
    console.info("CAM30 response ", JSON.stringify(reply,null,'  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.error("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    if (reply.header && reply.header.statusCode && 'C005' == reply.header.statusCode) {
        console.log("authentication successful, get localSSO ");
        
         // TODO : get the localSSO command
        /*
        return r.post("https://" + sdehost + "/1/3?idv_cmd=idv.Registration", {
            form: {
                // TODO : complete the form
                // idv_OtpDefer: true
            }
        })
        */

    } else {
        console.log('authentication successful, not deferred');
        //return Promise.resolve(reply);
        // return r.get('https://' + sdehost + '/1/3/testing-pages/souscription-lynxo');
    }
    // 
    // Next : DECONNECTION 
    return r.get('https://' + sdehost + '/1/3/?idv_cmd=idv.Logoff&nextPage=hbfr.rbwm.deconnexion');
        
       
})
// Then wait for the POST CAM30 response (getlocalSSO)
/*
.then(function(reply) {
    console.log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    // 
    // Next : DECONNECTION 
    return r.get('https://' + sdehost + '1/3/?idv_cmd=idv.Logoff&nextPage=hbfr.rbwm.deconnexion');
})
*/
// Then wait for DECONNEXION response
.then(function(reply) {
        console.info("DECONNEXION ");
        //
        // TODO : Find the good deconnexion URL
        //
        if (reply.match(/DOCTYPE html/)) {
            console.log("Landed on DECONNEXION HTML page");
        }
        /*
        if ((!reply || !reply.header || ! reply.header.returnCode || reply.header.returnCode != 'OK')
            || (!reply.token) ) {
            console.error("error status ", reply.header.returnCode);
            return Promise.reject(reply);
        }
        */
        return Promise.resolve(reply);
    }
//
// SAFETY NET
).then(function(reply) {
    console.info("ERROR : Unexpected  success", JSON.stringify(reply ? reply : ''));
//
// Catch on error (any)
}).catch(function(reply) {
    if (reply) {
        console.error("ERROR : Unexpected error ", JSON.stringify(reply));
    }
});
