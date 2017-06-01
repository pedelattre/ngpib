""" Tests scenarios for ngPIB Website"""
from __future__ import division

import unittest
from selenium import webdriver

URL='http://localhost:4200'
#URL = 'http://441481051737-eu-west-1-ngpib.s3-website-eu-west-1.amazonaws.com/login'

class WebTest(unittest.TestCase):
    """ xxx """
    driver = None

    @classmethod
    def setUpClass(cls):
        """ Open Chromedriver connection ont top of all tests """
        cls.driver = webdriver.Chrome('./chromedriver')

    def testLoginPageHomePage(self):
        """ Test title """
        self.driver.get(URL)
        element = self.driver.find_element_by_css_selector(
            'body > app-root > div > main > section > app-login > div > h2'
            )
        self.assertEquals(element.text, u'Svp, connectez vous \xe0 votre banque en ligne')

    def testLoginPageHomePage2(self):
        """ Test memorable question label """
        self.driver.get(URL)
        element = self.driver.find_element_by_css_selector(
            'body > app-root > div > main > section > app-login > div > form > div:nth-child(2) > label'
            )
        self.assertEquals(element.text, u'Memorable answer')

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == '__main__':
    unittest.main()
