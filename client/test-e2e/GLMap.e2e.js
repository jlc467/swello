'use strict';


const WAIT = 10000;

module.exports = {
  'Credit hrefs should appear on screen'(browser) {
    browser
      .url('http://localhost:8080/#/map')
      .waitForElementVisible('body', WAIT)
      .waitForElementVisible('#credits', WAIT)
      .assert.visible('#credits')
      .assert.containsText('#credits span:first-of-type', 'Maps Powered By')
      .assert.containsText('#credits a:first-of-type', '© Mapbox')
      .assert.containsText('#credits a:nth-of-type(2)', '© OpenStreetMap')
      .assert.containsText('#credits a:nth-of-type(3)', 'Forecast.io')
      .assert.containsText('#credits a:nth-of-type(4)', '© Weather Underground')
      .assert.title('Map | Swello')
      .end();
  }
};
