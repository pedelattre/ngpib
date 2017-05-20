
    'use strict';
var request = require('request-promise');
var express = require('express');
var app = express();
app.use(express.static('s'));
// allows to trace each request and redirect on the console
require('request-debug')(request);
app.get('/', function (req, res) {
    res.redirect("/index.html");
});
app.get('/souscription', function (req, res) {
    var userid= req.query.userid;
    var password = req.query.password;
    var memans = req.query.memans;
    souscription(userid, password, memans, res);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
function souscription(userid, password, memans, res) {

    var r = request
        .defaults({
            strictSSL: false, // test environment uses invalid ssl certificates
            followAllRedirects: true,
            json: true,
            jar: request.jar(), // takes set-cookies into account
            'proxy': require('./proxy').proxy// if required to exit corporate network
        });

    var sdehost = 'www.eu532.p2g.netd2.hk.hsbc';
    // var sdehost = 'www.hkg2vl0575-eu.p2g.netd2.hsbc.com.hk';
// const sdehost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk';
    var user = {
        // id: '01010097250', // standard user
        // id: '31564944768', // standard user
        // password: 'carambar',
        // memorableAnswer: 'platini',
        id: userid, // standard user
        password: password,
        memorableAnswer: memans,
        rccDigits: []
    };
    var replies = [];

    function log() {
        var args = Array.prototype.slice.call(arguments);
        console.log.apply(null, args);
        replies.push(args);
    }
    function logtoString(messages) {
        var ret = '';
        replies.forEach(function(s){
            var m = '';
            var type = typeof  s;
            if (type  =='string' || type== 'number' || type == 'boolean') {
                m+= s;
            } else if (s.length) {
                m += s.join(',');
            } else {
                m += JSON.stringify(s);
            }
            ret += (m+"\n");
        });
        return ret;
    }

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
        log("CAM10 response ", JSON.stringify(reply, null, '  '));
        if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
            log("error status ", reply.header.statusCode);
            return Promise.reject(reply);
        }
        user.rccDigits = reply.body.rccDigits.split(',').map(function (c) {
            return parseInt(c)
        });
        return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30');
    }).then(function (reply) {
        log("reponse TEST_MOBILE_CAM30", reply);
        if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
            log("error status ", reply.header.statusCode);
            return Promise.reject(reply);
        }
        var rccPassword = user.rccDigits.map(function (d) {
            return user.password.charAt( d < 7 ? d - 1: user.password.length- 1- (8-d));
        }).join('');
        log('authenticating rccPassword=', rccPassword, 'memAnswer=', user.memorableAnswer);
        return r.post('https://' + sdehost + '/1/2/',
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
    }).then(function (reply) {
        log("CAM30 response ", JSON.stringify(reply, null, '  '));
        if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
            log("error status ", reply.header.statusCode);
            return Promise.reject(reply);
        }
        if (reply.header && reply.header.statusCode
            && ('C005' == reply.header.statusCode || 'C009' == reply.header.statusCode)) {
            log("authentication successful, deferring OTP, ", reply.header.statusCode);
            return r.post("https://" + sdehost + "/1/3?idv_cmd=idv.Registration", {
                form: {
                    idv_OtpDefer: true
                }
            })
        } else {
            log('authentication successful, not deferred');
            return Promise.resolve(reply);
        }
    }).then(function (reply) {
        log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
        if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
            log("error status ", reply.header.statusCode);
            return Promise.reject(reply);
        }
        return r.get('https://' + sdehost + '/1/3/srv/pfm/souscription');
    }).then(
        function (reply) {
            log("POST SOUSCRIPTION response ", JSON.stringify(reply));
            if ((!reply || !reply.header || !reply.header.returnCode || reply.header.returnCode != 'OK')
                || (!reply.token)) {
                log("error status ", reply.header.returnCode);
                return Promise.reject(reply);
            }
            return Promise.resolve(reply.token);

            /*
             need proxy for that
             }).then(function(reply) {

             log("SUCCESS souscription, checking access to bad, token ",reply);

             return r.get("https://client.oat2.hsbc.fr/cgi-bin/emmob?Appl=WEBACC&encrypted_hub_id=" + reply);
             */
    }).then(function (reply) {
        log(JSON.stringify(reply));
        res.set('Cache-Control', 'public, max-age=0');
        res.status(200).append("Content-Type", "text/plain").send(logtoString(replies));
        // that.result = reply;
    }).catch(function (reply) {
        log(reply);
        if (reply.header && reply.header.returnCode == "NOT_ELIGIGBLE") {
            log("ERROR : Unexpected  reject ", JSON.stringify(reply));
            res.status(400).send(logtoString(replies));
        } else {
            log("ERROR : Unexpected  error ", JSON.stringify(reply));
            res.status(400).send(logtoString(replies));
        }
    });
}

module.exports = app;