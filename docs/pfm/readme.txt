UserAgent : HSBC/1.5.15.0


Se reporter au js pour les variables idvHost, IC_Host, IP_Host
## Partie commune
1/ GET 'https://' + idvHost + '/1/2/mobile15/system-maintenance?service=PFM' : permet de savoir si le service est ouvert ou non.
reponses : si ouvert : {"body":{},"header":{"version":"1.1","token":"","errorMsg":[],"statusCode":"0000"}}
si ferme : {"body":{},"header":{"version":"1.1","token":"","errorMsg":[{"desc": "__unMessageExplicatif__","code": "0002"}],"statusCode":"E001"}}
2/ POST https://' + idvHost + '/1/2/?idv_cmd=idv.Authentication&userid=$$userid$$&initialAccess=true&nextPage=IDV_CAM10_AUTHENTICATION_MOBILE&CHANNEL=MOBILE&cookieuserid=&ver=1.1&json=&__locale=fr'.
si reply.header.statusCode === 'C015' => debranchement flow saas
sinon si reply.header.statusCode.match('/E.*/')=> erreur
sinon flow IDV

## flow Saas
1/ GET
'https://' + IC_host + '/1/2/?idv_cmd=idv.GetCommToken&nextPage=%2Fgroup%2Fgpib%2Fcmn%2Flayouts%2Fdefault.html&CHANNEL=MOBILE&function=Saas_Authentication&devtype=M&ver=1.1&json=&country=FR&region=HBFR&__locale=fr&targetCam=30&platform=l'
La query string correspond au json suivant {
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
                       platform: 'l'
                   }
si reply.header.errorMsg => error
sinon garder saasEnv = reply.body
2/ POST saasEnv.IP_URL + '?idv_cmd=idv.SaaSSecurityCommand&CHANNEL=MOBILE'
envoyer en body
   __initialAccess: true
   __initialLogon: true
   SAAS_TOKEN_ID: saasEnv.SAAS_TOKEN_ID
   SAAS_TOKEN_ASSERTION_ID: saasEnv.SAAS_TOKEN_ASSERTION_ID
   CHANNEL: 'MOBILE'
   ver: "1.1"
   json: ""
   __locale: locale
exemple de body
__initialAccess=true&__initialLogon=true&SAAS_TOKEN_ID=5fMeJ....c%253D&SAAS_TOKEN_ASSERTION_ID=ZVZO....QKHLQKSDH=MOBILE&ver=1.1&json=&__locale=fr'
3/ POST saasEnv.IP_URL + '/CAM10AuthenticationIP'
envoyer en body un json
    {
        application: {
            channel: 'MOBILE', countryCode: 'FR', groupMemberCode: 'HBFR'
        },
        username: user.id,
        rememberMe: false
    }
exemple : '{"application":{"channel":"MOBILE","countryCode":"FR","groupMemberCode":"HBFR"},"username":"FR_PT2_37149401210","rememberMe":false}'
Normalement pas d'erreur (sinon erreur dans la partie commune?)
Si !reply.isPasswordAuthAllowed => pas possible de s'authentifier avec un mdp=> FAIL

4/ POST saasEnv.IP_URL + '/passwordAuth?CHANNEL=MOBILE'
en body le json
    {
       sessionToken: reply.sessionToken,
       username: reply.maskUserName,
       password: password,
       dosi: '',
       application: {
           channel: 'MOBILE', countryCode: 'FR', groupMemberCode: 'HBFR'
       }
   }
5/ recuperer reply.displayResource et faire un
POST saasEnv.IP_URL + '/' + reply.displayResource + '/?CHANNEL=MOBILE'
6/ POST saasEnv.IP_URL + '/SaaSMobileLogoutCAM0Resource/?CHANNEL=MOBILE&devType=M&ver=1.1&json=&platform=I'
7/ recuperer reply.body.SAAS_TOKEN_ID  et reply.body.SAAS_TOKEN_ASSERTION_ID (on sso back vers le Serveur SAAS - IC_Host)
GET 'https://' + IC_host + '/1/2/?idv_cmd=idv.SaaSSecurityCommand&function=postCommToken&SAAS_TOKEN_ID=$$SAAS_TOKEN_ID$$&SAAS_TOKEN_ASSERTION_ID=$$SAAS_TOKEN_ASSERTION_ID$$&CHANNEL=MOBILE&devType=M&ver=1.1&json=&platform=I'
8/ enfin on peut
GET 'https://' + IC_host + '/1/3/srv/pfm/souscription'

je n'ai pas reussi a faire fonctionner pour l'instant le flow idv, il semble que qq chose a changé, le serveur s'obstine a me renvoyer du html ... peut etre est il necessaire de specifier un user-agent particulier.

Les differents codes d'erreur  documentés sont les suivants. En pratique ceux qui vont nous interesser sont C001, C015.
Dans tous les autres cas je pense qu'il sera necessaire d'inviter l'utilisateur a se connecter avec l'applicaiton mobile HSBC.

Codes
C001 : GSM session invalid
       Multiple Logon
C003: Stepup required
S003 : Mobile Link(within same entity ID)
C004	Need to accept T&C during logon
C005	Hard token activation – end of  grace period
C007	Hard token activation – within  grace period
C008	Soft token activation – end of  grace period
C009	Soft token activation – within grace period
C013	OLR not setup
C015	Phase migration (After cam10Auth
S001	Credential migration
S002	Token Choice
R001	Soft token order – end of grace period
R002	Soft token order – within grace period
C012	Insufficient credential

http://teams.europe.hsbc/hts/digitalrbwm/HBFR_GSP_Implementation/Lists/SaaS%20and%20IDV%20Profile/Allitemsg.aspx


