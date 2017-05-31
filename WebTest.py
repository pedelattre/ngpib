import unittest

from selenium import webdriver

URL='http://localhost:4200'

class WebTest(unittest.TestCase):

    driver = None

    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Chrome('./chromedriver')

    def testPollsHomePage(self):
        self.driver.get(URL)
        element = self.driver.find_element_by_css_selector(
            'body > app-root > div > main > section > app-login > div > h2'
            )
        print("Catched element is " + element.text)
        self.assertEquals(element.text, 'Connectez vous \xe0 votre banque en ligne')

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
