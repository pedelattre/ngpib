"""
authenticate.py : a tentative Python program for doing like authenticate.js

"""
import requests
import logging

logging.basicConfig(
        level='DEBUG',
        format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        #filename=args.logout,
        #filemode='a'
        )

# Globals
SDEHOST = 'eu532user:Pr0tect@www.eu532.p2g.netd2.hsbc.com.hk'
PIBHOST = 'client.oat2.hsbc.fr'
USER = {
    #'id': '02100157235', # Business card only holder (carambar, chomeur)
    #'id': '02930007827', # standard user (carambar, platini)
    #'id': '01724387351', # private bank user (carambar, chomeur)
    #'id': '33730489975', # Vincent account
    'id' : '01020029276', # Normal user (carambar, platini)
    'password' : 'carambar',
    'memorableAnswer' : 'platini',
    'rccDigits' : []
}
LOCALE = 'fr'
HTTP_OPTIONS = {
    'strictSSL': False, # test environment uses invalid ssl certificates
    'followAllRedirects': True,
    'json': True,
    #resolveWithFullResponse: true,
    'jar': True, # takes set-cookies into account
}
HTTP_HEADERS = {
    'Accept-Language':'en-US,en;q=0.8,fr-FR;q=0.6,fr;q=0.4',
    'Accept':'*/*',
    'Accept-Encoding':'application/x-www-form-urlencoded',
    'DNT':'1',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrom/45.0.2454.101 Safari/537.36'
}

# CAM10 Request
URL = 'https://' + SDEHOST + '/1/2/'
r = requests.post(
    url=URL,
    data={
        'idv_cmd': 'idv.Authentication',
        'initialAccess': 'true',
        'nextPage': 'IDV_CAM10_AUTHENTICATION_MOBILE',
        'userid': 'user.id',
        'cookieuserid': 'false',
        'ver': '1.1',
        'json': '',
        '__locale': LOCALE,
        'CHANNEL': 'MOBILE'
        },
    headers=HTTP_HEADERS)


response = r.text

# Get rccDigits
USER['rccDigits'] = response.body #.rccDigits.split(',').map(function (c) {return parseInt(c) });

# Get CAM20 login
URL = 'https://' + SDEHOST + '/1/2/authentication/TEST_MOBILE_CAM30'
response = requests.get(
    url=URL,
    headers=HTTP_HEADERS
    )
