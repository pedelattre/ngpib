
# Authentication MOBILE flow

UserAgent : HSBC/1.5.15.0

## Partie commune

Se reporter au js pour les variables idvHost, IC_Host, IP_Host

- GET 'https://' + idvHost + '/1/2/mobile15/system-maintenance?service=PFM' : permet de savoir si le service est ouvert ou non.
    * reponses : 
        * si ouvert : 
        ```
        {"body":{},"header":{"version":"1.1","token":"","errorMsg":[],"statusCode":"0000"}}
        ```
        * si ferme : 
        ```
        {"body":{},"header":{"version":"1.1","token":"","errorMsg":[{"desc": "__unMessageExplicatif__","code": "0002"}],"statusCode":"E001"}}
        ```
- POST 'https://' + idvHost + '/1/2/?idv_cmd=idv.Authentication&userid=$$userid$$&initialAccess=true&nextPage=IDV_CAM10_AUTHENTICATION_MOBILE&CHANNEL=MOBILE&cookieuserid=&ver=1.1&json=&__locale=fr'.
    * responses :
        * si reply.header.statusCode === 'C015' => debranchement flow saas
        * sinon si reply.header.statusCode.match('/E.*/')=> erreur
        * sinon flow IDV

## ErrorCodes

Les differents codes d'erreur  documentés sont les suivants. En pratique ceux qui vont nous interesser sont C001, C015.
Dans tous les autres cas je pense qu'il sera necessaire d'inviter l'utilisateur a se connecter avec l'applicaiton mobile HSBC.

C001 : GSM session invalid Multiple Logon
C003 : Stepup required
S003 : Mobile Link(within same entity ID)
C004 : Need to accept T&C during logon
C005 : Hard token activation – end of  grace period
C007 : Hard token activation – within  grace period
C008 : Soft token activation – end of  grace period
C009 : Soft token activation – within grace period
C013 : OLR not setup
C015 : Phase migration (After cam10Auth
S001 : Credential migration
S002 : Token Choice
R001 : Soft token order – end of grace period
R002 : Soft token order – within grace period
C012 : Insufficient credential

http://teams.europe.hsbc/hts/digitalrbwm/HBFR_GSP_Implementation/Lists/SaaS%20and%20IDV%20Profile/Allitemsg.aspx




### Deploiement dans PCF

il faut mettre a jour le proxy.js avec un user/mdp qui marche sur le proxy HSBC

`cf push pfm -b nodejs_buildpack`