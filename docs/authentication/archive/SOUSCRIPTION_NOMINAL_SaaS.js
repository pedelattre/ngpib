'use strict';
var https = require('https');
https.globalAgent.keepAlive = true
var request = require('request-promise');
var express = require('express');
var saasErrors = require('./saasError_fr_FR');
var app = express();
app.use(express.static('s'));
// allows to trace each request and redirect on the console
require('request-debug')(request);
app.get('/', function (req, res) {
    res.redirect("/index.html");
});

var envs = {
    eu532: {IDV:'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk'},
    SaaS_RC:  {IDV: 'www.hkg2vl0578-eu.p2g.netd2.hsbc.com.hk', IC:'www.hkg2vl0577-eu.p2g.netd2.hsbc.com.hk'},
    SaaS_PT:  {IDV: 'www.hkg2vl0575-eu.p2g.netd2.hsbc.com.hk', IC:'www.hkg2vl0576-eu.p2g.netd2.hsbc.com.hk'},
};
var defaultIdvHost = 'www.hkg2vl0575-eu.p2g.netd2.hsbc.com.hk';
// var defaultIdvHost = 'www.hkg2vl0578-eu.p2g.netd2.hsbc.com.hk';
var legacyIdvHost = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk';
// IP_host is obtained from getCommToken@IP_URL
var defaultIC_host = 'www.hkg2vl0576-eu.p2g.netd2.hsbc.com.hk'; // PT2 :supporte la migration; n
// var defaultIC_host = 'www.hkg2vl0577-eu.p2g.netd2.hsbc.com.hk'; // PT2 :supporte la migration; n

app.get('/souscription', function (req, res) {
    var userid = req.query.userid;
    var password = req.query.password;
    var memans = req.query.memans;
    let env = envs[req.query.env];
    let idvEnv = env.IDV;
    let defaultIC_host = env.IC;
        // 'eu532' === req.query.env ? legacyIdvHost : defaultIdvHost;
    if (!userid || !password || ''===userid || '' === password || !env) {
        res.status(400).send('unexpected arguments');
    } else {
        souscription(userid, password, memans, res, idvEnv, defaultIC_host);
    }

});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});


function souscription(userid, password, memans, res, idvHost, IC_host) {
    var r = request
        .defaults({
            strictSSL: false, // test environment uses invalid ssl certificates
            followAllRedirects: true,
            json: true,
            jar: request.jar(), // takes set-cookies into account
            'proxy': require('./proxy').proxy// if required to exit corporate network
        });
    var user = {
        id: userid,
        password: password,
        memorableAnswer: memans,
        rccDigits: [] // only used for idv
    };
    var replies = [];

    function log() {
        var args = Array.prototype.slice.call(arguments);
        console.error.apply(null, args);
        replies.push(args);
    }

    var locale = 'fr';
    log('querying ' + 'https://' + idvHost + '/1/2/mobile15/system-maintenance?service=PFM&locale=fr');
    r.get('https://' + idvHost + '/1/2/mobile15/system-maintenance?service=PFM&locale=fr')
        .then(function (reply) {
            log('system-maintenance reply', JSON.stringify(reply, null, '  '));
            log('ATTENTION : NEED TO DISCARD SESSION, as it is not associated with MOBILE');
            r = request
                .defaults({
                    strictSSL: false, // test environment uses invalid ssl certificates
                    followAllRedirects: true,
                    json: true,
                    jar: request.jar(), // takes set-cookies into account
                    'proxy': require('./proxy').proxy// if required to exit corporate network
                });
            if (reply.statusCode === 'E001') {
                // service closed or closing
                let message = ''; // default message ?
                if (reply.header.errorMsg && reply.header.errorMsg[0] && reply.header.errorMsg[0].code === '0002') {
                    message = reply.header.errorMsg[0].desc;
                }
                return Promise.reject(reply);
            } else {
                // CAM10, GET , marche pas en POST
                let url = 'https://' + idvHost + '/1/2/?' + require('querystring').stringify(
                        {
                            idv_cmd: "idv.Authentication",
                            userid: user.id,
                            initialAccess: true,
                            nextPage: "IDV_CAM10_AUTHENTICATION_MOBILE",
                            CHANNEL: 'MOBILE',
                            cookieuserid: false,
                            ver: "1.1",
                            json: "",
                            __locale: locale,
                            LANGTAG: locale,
                            COUNTRYTAG: 'FR',
                            platform: 'I',
                            devtype: 'M'
                        }
                    );
                log(`querying [${url}]`);
                return r.post(url);

            }
        })
        .then(function (reply) {
            log("CAM10 response ", JSON.stringify(reply, null, '  '));
            // todo errorCodes : C011=>logoff,C015=>migration,W001=>invalidUser?
            if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
                log("error status ", reply.header.statusCode);
                if (reply.header.statusCode === 'E001' && reply.header.errorMsg && reply.header.errorMsg[0].code === '0001') {
                    log('unknown user');
                    return Promise.reject({reason: 'unknown user', reply: reply});
                } else {
                    return Promise.reject({reason: 'unknown reason', reply: reply});
                }
            } else if (reply.header && reply.header.statusCode && reply.header.statusCode === 'C015') {
                // client SaaS
                saasSubflow(reply);
            } else {
                idvSubflow(reply);
            }
        })
        .catch(function (reply) {
            log(reply);
            if (reply.header && reply.header.returnCode == "NOT_ELIGIGBLE") {
                log("ERROR : Unexpected  reject ", JSON.stringify(reply));
                res.status(400).send(logtoString(replies));
            } else {
                log("ERROR : Unexpected  error ", JSON.stringify(reply));
                res.status(400).send(logtoString(replies));
            }
        });
    // TODO this doesn't work currently, for an unknown reason the server is replying using HTML (with the CAM30 credentials page)
    function idvSubflow(reply) {
        // return r.get('https://' + sdehost + '/1/2/authentication/TEST_MOBILE_CAM30'
        user.rccDigits = reply.body.rccDigits.split(',').map(function (c) {
            return parseInt(c)
        });
        user.memorableQuestion = reply.body.memQuestion;
        return r.get('https://' + idvHost + '/1/2/authentication/TEST_MOBILE_CAM30?CHANNEL=MOBILE&locale=en&CHANNEL=MOBILE&ver=1.1&json=&platform=I&devtype=M'
        ).then(function (reply) {
            log("reponse TEST_MOBILE_CAM30", JSON.stringify(reply));
            if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
                log("error status ", reply.header.statusCode);
                return Promise.reject(reply);
            }
            var rccPassword = user.rccDigits.map(function (d) {
                return user.password.charAt(d < 7 ? d - 1 : user.password.length - 1 - (8 - d));
            }).join('');
            log('authenticating rccPassword=' + rccPassword + ',memAnswer=' + user.memorableAnswer);
            return r.post('https://' + idvHost + '/1/2/',
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
            log(reply);
            if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
                log("error status ", reply.header.statusCode);
                return Promise.reject(reply);
            }
            if (reply.header && reply.header.statusCode
                && ('C005' == reply.header.statusCode || 'C009' == reply.header.statusCode)) {
                log("authentication successful, deferring OTP, ", reply.header.statusCode);
                return r.post("https://" + idvHost + "/1/3?idv_cmd=idv.Registration", {
                    form: {
                        idv_OtpDefer: true
                    }
                })
            } else {
                log('authentication successful, not deferred');
                return Promise.resolve(reply);
                // return r.get('https://' + idvHost + '/1/3/testing-pages/souscription-lynxo');
            }
        }).then(function (reply) {
            log("POST CAM30 response ", JSON.stringify(reply, null, '  '));
            if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
                log("error status ", reply.header.statusCode);
                return Promise.reject(reply);
            }
            // return r.get('https://' + idvHost + '/1/3/testing-pages/souscription-lynxo');
            return r.get('https://' + idvHost + '/1/3/srv/pfm/souscription');
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

    function saasSubflow(reply) {

        let saasEnv;
        r.get('https://' + IC_host + '/1/2/?' + require('querystring').stringify({
                idv_cmd: 'idv.GetCommToken',
                nextPage: '/group/gpib/cmn/layouts/default.html',
                CHANNEL: 'MOBILE',
                function: 'Saas_Authentication',
                devtype: 'M',
                ver: "1.1",
                json: "",
                country: 'FR',
                region: 'HBFR',
                __locale: locale,
                targetCam: 30,
                platform: 'I'
            }))
            .then(function (reply) {
                log('IC_HOST getCommToken response', JSON.stringify(reply, null, '  '));
                if (reply.header && reply.header.errorMsg) {
                    if (reply.header.errorMsg[0] && reply.header.errorMsg[0].desc != null) {
                        return Promise.reject({reason: reply.header.errorMsg[0], reply: reply});
                    } else {
                        return Promise.reject(reply);
                    }
                } else {
                    saasEnv = reply.body;
                    var groups = /(https:\/\/)(www\.)([^-]+)(.*)/.exec(saasEnv.IP_URL);
                    if (groups && groups.length == 5) {
                        // this is a hack for testing environment avoiding the HTTP basic auth by the proxy, in produciton the saasEnv.IP_URL can be used directly
                        saasEnv.IP_URL = groups[1] + groups[3] + '_IP01:Pr0tect' + groups[3] + '_IP01@' + groups[2] + groups[3] + groups[4];
                    }
                    return r.post(saasEnv.IP_URL + '?' + require('querystring').stringify({
                            idv_cmd: 'idv.SaaSSecurityCommand',
                            CHANNEL: 'MOBILE'
                        }), {
                        form: {
                            __initialAccess: true,
                            __initialLogon: true,
                            SAAS_TOKEN_ID: saasEnv.SAAS_TOKEN_ID,
                            SAAS_TOKEN_ASSERTION_ID: saasEnv.SAAS_TOKEN_ASSERTION_ID,
                            CHANNEL: 'MOBILE',
                            ver: "1.1",
                            json: "",
                            __locale: locale
                        }
                    });
                }

            })
            .then(function (reply) {
                log('IP_HOST SaaSSecurityCommand response', JSON.stringify(reply, null, '  '));
                /*
                 return r.get(saasEnv.IP_URL + '/MOBILE_LOGON_FIRST_CALL?' + require('querystring').stringify({CHANNEL: 'MOBILE'}));
                 })
                 .then(function (reply) {
                 console.log('IP_HOST MOBILE_LOGON_FIRST_CALL response', JSON.stringify(reply, null, '  '));
                 */
                return r.post(saasEnv.IP_URL + '/CAM10AuthenticationIP', {
                    body: {
                        application: {
                            channel: 'MOBILE', countryCode: 'FR', groupMemberCode: 'HBFR'
                        },
                        username: user.id,
                        rememberMe: false
                    }
                });
            })
            .then(function (reply) {
                log("CAM10 response ", JSON.stringify(reply, null, '  '));
                if (reply.responseInfo && reply.responseInfo.code && reply.responseInfo.code.match(/^E.*$/)) {
                    log("error status ", reply.header.statusCode);
                    return Promise.reject(reply);
                } else if (reply.responseInfo && reply.responseInfo.code && reply.responseInfo.code==='W001') {
                    // user does not exist : should not reach as we got C015 previously
                    return Promise.reject({reason:'user does not exist', reply:reply});
                } else if (!reply.isPasswordAuthAllowed) {
                    return Promise.reject({reason:'too many failed attempts', reply:reply});
                } else if (!reply.pwdRemainAttempt) {
                    return Promise.reject({reason:'password authentication not allowed', reply:reply});
                } else {
                    var body = {
                        sessionToken: reply.sessionToken,
                        username: reply.maskUserName,
                        password: password,
                        application: {
                            channel: 'MOBILE', countryCode: 'FR', groupMemberCode: 'HBFR'
                        }
                    };
                    // if too many failed attempts SaaS asks for DOSI (memorable answer, date of birth)
                    if (reply.isPwdRequireDosi && reply.pwdDosiRemainAttempt) {
                        log(`CAM30 asks for DOSI, adding memorableAnswer=${user.memorableAnswer}`);
                        body.dosi = user.memorableAnswer
                    } else {
                        body.dosi = '';
                    }
                    log('calling /passwordAuth ', JSON.stringify(body));
                    return r.post(saasEnv.IP_URL + '/passwordAuth?CHANNEL=MOBILE', {
                        body: body
                    });
                }
            })
            .then(function (reply) {
                log("reponse passwordAuth", JSON.stringify(reply, null, '  '));
                // expects E001 if error.
                if (!reply.displayResource || reply.responseInfo && reply.responseInfo.reasons) {
                    if (reply.responseInfo.reasons.find(r=>r.code && r.code.match(/^E.*$/))) {
                        log("error status ", JSON.stringify(reply.responseInfo.reasons.find(r=>r.code && r.code.match(/^E.*$/))));
                        return Promise.reject(reply);
                    } else {
                        let error = getErrorMapping(reply.responseInfo.reasons);
                        if (!error.isSuccess) {
                            error.reply = reply;
                            return Promise.reject(error);
                        }
                    }
                }
                return r.post(saasEnv.IP_URL + '/' + reply.displayResource + '/?' + require('querystring').stringify({CHANNEL: 'MOBILE'}));

            })
            .then(function (reply) {
                log("response [displayResource]", JSON.stringify(reply, null, '  '));
                if (reply.header && reply.header.statusCode && reply.header.statusCode.match(/^E.*$/)) {
                    log("error status ", reply.header.statusCode);
                    return Promise.reject(reply);
                }
                if (reply.header && reply.header.statusCode
                    && (/^C00[58]$/.exec(reply.header.statusCode) || 'R001' === reply.header.statusCode)) {
                    log("authentication successful, OTP end of grace period; not blocking, ", reply.header.statusCode);
                    return Promise.resolve(reply);
                } else if (reply.header && reply.header.statusCode
                    && (/^C00[79]$/.exec(reply.header.statusCode) || 'R002' === reply.header.statusCode)) {
                    log("authentication successful, OTP within of grace period; not blocking, ", reply.header.statusCode);
                    return Promise.resolve(reply);
                } else {
                    log('authentication successful, not deferred');
                    return Promise.resolve(reply);
                }
            })
            .then(function (reply) {
                return r.post(saasEnv.IP_URL + '/SaaSMobileLogoutCAM0Resource/?' + require('querystring').stringify({
                        CHANNEL: 'MOBILE',
                        devType: 'M',
                        ver: '1.1',
                        json: '',
                        platform: 'I'
                    }));
            }).then(
            function (reply) {
                log("response SaaSMobileLogoutCAM0Resource ", JSON.stringify(reply, null, '  '));
                saasEnv.SAAS_TOKEN_ID = reply.body.SAAS_TOKEN_ID;
                saasEnv.SAAS_TOKEN_ASSERTION_ID = reply.body.SAAS_TOKEN_ASSERTION_ID;
                return r.get(reply.body.requestedURI + '?' + require('querystring').stringify({
                        idv_cmd: 'idv.SaaSSecurityCommand', function: 'postCommToken',
                        SAAS_TOKEN_ID: saasEnv.SAAS_TOKEN_ID, SAAS_TOKEN_ASSERTION_ID: saasEnv.SAAS_TOKEN_ASSERTION_ID,
                        CHANNEL: 'MOBILE', devType: 'M', ver: '1.1', json: '', platform: 'I'
                    }));
            }).then(
            function (reply) {
                log("response postCommToken ", JSON.stringify(reply, null, '  '));
                return r.get('https://' + IC_host + '/1/3/srv/pfm/souscription');

            }).then(
            function (reply) {
                log("POST SOUSCRIPTION response ", JSON.stringify(reply, null, '  '));
                if ((!reply || !reply.header || !reply.header.returnCode || reply.header.returnCode != 'OK')
                    || (!reply.token)) {
                    log("error status ", reply.header.returnCode);
                    return Promise.reject(reply);
                }
                return Promise.resolve(reply);
            })
            .then(function (reply) {
                res.set('Cache-Control', 'public, max-age=0');
                res.status(200).append("Content-Type", "text/plain").send(logtoString(replies));
                // that.result = reply;
            })
            .catch(function (reply) {
                log(JSON.stringify(reply, null, '  '));
                if (reply.header && reply.header.returnCode == "NOT_ELIGIGBLE") {
                    log("ERROR : Unexpected  reject ", JSON.stringify(reply));
                    res.status(400).send(logtoString(replies));
                } else {
                    log("ERROR : Unexpected  error ", JSON.stringify(reply));
                    res.status(400).send(logtoString(replies));
                }
            });

    }
}
function logtoString(messages) {
    var ret = '';
    messages.forEach(function (s) {
        var m = '';
        var type = typeof  s;
        if (type == 'string' || type == 'number' || type == 'boolean') {
            m += s;
        } else if (s.length) {
            m += s.join(',');
        } else {
            m += JSON.stringify(s);
        }
        ret += (m + "\n");
    });
    return ret;
}


function getErrorMapping(error) {
    let self = this;
    let isSuccess = false;
    let isWarning = false;
    let isError = false;
    let errorMsg = [];
    let errObject = {};
    let code, type;
    if (error.length > 0) {

        for (var i = 0; i < error.length; i++) {
            if (error[i] != null) {
                if (error[i].code != undefined) {
                    code = error[i].code;
                    type = error[i].type;
                    //errorCode[i] = code;
                    //errorMsg[i] = self._err["reasonCodes"][code]; //map to [reasonCodes] defined in error.js
                    if (code == "016") {
                        errObject.isError = true;
                    } else if (code == "008" || code == "004") {
                        errObject.isWarning = true;
                    } else {
                        errObject.isSuccess = true;
                    }

                    if (error[i].traceCde != undefined) {
                        for (var l = 0; l < error[i].traceCde.length; l++) { //replace the trceCde
                            if (error[i].traceCde[l].cde != undefined && error[i].traceCde[l].cde != '') {
                                if (saasErrors[error[i].traceCde[l].cde] != undefined) {
                                    errorMsg[i] = saasErrors[error[i].traceCde[l].cde];
                                    if (errorMsg[i] == '') {
                                        errorMsg[i] = saasErrors['commErr'].replace(/~~e/, error[i].traceCde[l].cde);
                                    }
                                    console.log("The error is " + errorMsg[i]);
                                } else {
                                    errorMsg[i] = "Une erreur inattendue est survenue (" + error[i].traceCde[l].cde + ")";
                                }
                                errObject.errMsg = errorMsg[i];
                            }
                        }
                    }

                }
            }
        }
    }
    return errObject;
}

module.exports = app;