'use strict';
var request = require('request-promise');
// allows to trace each request and redirect on the console
// require('request-debug')(request);

var r = request
    .defaults({
        strictSSL: false, // test environment uses invalid ssl certificates
        followAllRedirects: true,
        json: true,
        jar: true // takes set-cookies into account
        // 'proxy':'http://user:pass@uk-proxy-01.systems.uk.hsbc' // if required to exit corporate network
    });

const sdehost = 'www.eu532.p2g.netd2.hk.hsbc';
// const sdehost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk';
var user = {
    id: '01724387351',
    password: 'carambar',
    memorableAnswer: 'chomeur',
    rccDigits: []
};

var locale = 'fr';
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
).then(function (reply) {
    console.log("CAM10 response ", JSON.stringify(reply,null,'  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    user.rccDigits = reply.body.rccDigits.split(',').map(function (c) {return parseInt(c) });
    return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30');
}).then(function(reply) {
    console.log(reply);
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
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
}).then(function(reply) {
    console.log("CAM30 response ", JSON.stringify(reply,null,'  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    if (reply.header && reply.header.statusCode && 'C005' == reply.header.statusCode) {
        console.log("authentication successful, deferring OTP");
        return r.post("https://" + sdehost + "/1/3?idv_cmd=idv.Registration", {
            form: {
                idv_OtpDefer: true
            }
        })
    } else {
        console.log('authentication successful, not deferred');
        return Promise.resolve(reply);
        // return r.get('https://' + sdehost + '/1/3/testing-pages/souscription-lynxo');
    }
}).then(function(reply) {
    console.log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
    if (reply.header && reply.header.statusCode  && reply.header.statusCode.match(/^E.*$/)) {
        console.log("error status ", reply.header.statusCode);
        return Promise.reject(reply);
    }
    return r.get('https://' + sdehost + '/1/3/testing-pages/souscription-lynxo');
}).then(
    function(reply) {
        console.log("POST SOUSCRIPTION response ", JSON.stringify(reply));
        if ((!reply || !reply.header || ! reply.header.returnCode || reply.header.returnCode != 'OK')
          || (!reply.token) ) {
            console.log("error status ", reply.header.returnCode);
            return Promise.reject(reply);
        }
        return Promise.resolve(reply.token);
    }
).then(function(reply) {
    console.log("ERROR : Unexpected  success");
}).catch(function(reply) {
    if (reply.header.returnCode=="NOT_ELIGIBLE"
            && "PrivateBank" == reply.header.reasons[0]) {
        console.log("SUCCESS, expected rejection", JSON.stringify(reply));
    } else {
        console.log("ERROR : Unexpected error ", JSON.stringify(reply));
    }
});
