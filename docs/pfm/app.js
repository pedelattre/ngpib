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
        //'proxy':'http://$pplsoft$:$password$@uk-proxy-01.systems.uk.hsbc' // if required to exit corporate network
    });

// const sdehost = 'www.eu532.p2g.netd2.hk.hsbc';
const sdehost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk';
var user = {
    id: '02100157235', // Business card only holder
    // id: '00430011591', // standard user
    // id: '01724387351', // private bank user
    password: '',
    memorableAnswer: '',
    rccDigits: []
};
var queryingSouscription = false;

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
).then(function (args) {
    console.log("CAM10 response ", JSON.stringify(args,null,'  '));
    if (args.header && args.header.statusCode  && '0000' != args.header.statusCode) {
        console.log("status != 0000 ");
    }
    user.rccDigits = args.body.rccDigits.split(',').map(function (c) {return parseInt(c) });
    return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30');
}).then(function(args) {
    console.log(args);
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
    if (reply.header && reply.header.statusCode  && 'C005' == reply.header.statusCode) {
        console.log("authentication successful, deferring OTP");
        return r.post("https://"+sdehost+"/1/3?idv_cmd=idv.Registration", {
            form: {
                idv_OtpDefer:true
            }
        })
    } else {
        console.log('authentication successful, not deferred');
        queryingSouscription = true;
        return r.get('https://' + sdehost + '/1/3/testing-pages/souscription-lynxo');
    }
}).then(function(reply) {
    console.log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
    if (queryingSouscription) {
        console.log("Souscription response ", JSON.stringify(reply, null, '  '));
    } else {
        queryingSouscription = true;
        if (reply.header && reply.header.statusCode  && '0000' != reply.header.statusCode) {
            console.log("status != 0000 ");
        } else {
            console.log('OTP Defer ok ');
            return r.get('https://' + sdehost + '/1/3/srv/pfm/souscription');
        }
    }
}).then(
    function(reply) {
        console.log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
        if (queryingSouscription) {
            console.log("Souscription response ", JSON.stringify(reply, null, '  '));
        }
    }
).catch(function(err) {
    console.log("failed", err);
    console.log(err.body)
});
