""" Tests scenarios for ngPIB Website"""
from __future__ import division

import unittest
from selenium import webdriver

#URL='http://localhost:4200'
URL = 'http://441481051737-eu-west-1-ngpib.s3-website-eu-west-1.amazonaws.com/login'

class WebTest(unittest.TestCase):
    """ xxx """
    driver = None

    @classmethod
    def setUpClass(cls):
        """ Open Chromedriver connection ont top of all tests """
        cls.driver = webdriver.Chrome('./chromedriver')

    def testLoginPageHomePageFr(self):
        """ Test title """
        self.driver.get(URL)
        element = self.driver.find_element_by_css_selector(
            'body > app-root > div > header > app-header > div > div:nth-child(1) > div.pull-left > span'
            )
        self.assertEquals(element.text, u'HSBC France, votre banque en ligne')

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == '__main__':
    unittest.main()
