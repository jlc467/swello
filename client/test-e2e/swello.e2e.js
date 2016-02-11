'use strict';
const WAIT = 10000;

module.exports = {
  'Credit hrefs should appear on screen'(browser) {
    browser
      .url('http://localhost:8080/#/map')
      .waitForElementVisible('body', WAIT)
      .pause(1000)
      .getLog('browser', function(logEntriesArray) {
        console.log('Log length: ' + logEntriesArray.length);
        logEntriesArray.forEach(function(log) {
          console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
        });
      })
      .waitForElementVisible('#credits', WAIT)
      .assert.visible('#credits')
      .assert.containsText('#credits span:first-of-type', 'Maps Powered By')
      .assert.containsText('#credits a:first-of-type', '© Mapbox')
      .assert.containsText('#credits a:nth-of-type(2)', '© OpenStreetMap')
      .assert.containsText('#credits a:nth-of-type(3)', 'Forecast.io')
      .assert.containsText('#credits a:nth-of-type(4)', '© Weather Underground');
  },
  'Page title should be Map | Swello'(browser) {
    browser
      .assert.title('Map | Swello')
  },
  'Clicking map should get current forecast'(browser) {
    browser
      .pause(20000)
      .getLog('browser', function(logEntriesArray) {
        console.log('Log length: ' + logEntriesArray.length);
        logEntriesArray.forEach(function(log) {
          console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
        });
      })
      .click("#map")
      .pause(20000)
      .getLog('browser', function(logEntriesArray) {
        console.log('Log length: ' + logEntriesArray.length);
        logEntriesArray.forEach(function(log) {
          console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
        });
      })
      .waitForElementVisible("[data-test='mini-forecast-temp']", WAIT);
      .getLog('browser', function(logEntriesArray) {
        console.log('Log length: ' + logEntriesArray.length);
        logEntriesArray.forEach(function(log) {
          console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
        });
      })
  },
  'Clicking full forecast loads full forecast route'(browser) {
    browser
      .click("[data-test='full-forecast-button']")
      .pause(1000)
      .assert.urlContains('full');
  },
  'Full forecast current temp is visible'(browser) {
    browser
      .waitForElementVisible("[data-test='full-forecast-current-temp']", WAIT);
  },
  'Clicking find forecast button loads map route'(browser) {
    browser
      .click("[data-test='find-forecast-button']")
      .pause(1000)
      .assert.urlContains('map');
  },
  'history.back() goes to full forecast'(browser) {
    browser
      .execute("window.history.back();")
      .pause(1000)
      .assert.urlContains('full');
  },
  'Clicking favorite button shows name starred item modal'(browser) {
    browser
      .click("[data-test='favorite-button']")
      .waitForElementVisible("[data-test='favorite-name-location-input']", 1500);
  },
  'Inputting name and clicking add hides name starred item modal'(browser) {
    browser
      .setValue("[data-test='favorite-name-location-input']", 'swello fav test')
      .pause(500)
      .click("[data-test='favorite-button-save']")
      .waitForElementNotPresent("[data-test='favorite-name-location-input']", 1500);
  },
  'Favorites button is visible after adding favorite'(browser) {
    browser
      .waitForElementVisible("[data-test='show-favorites-button']", 1500);
  },
  'Favorites sidebar visible after clicking show favorites'(browser) {
    browser
      .click("[data-test='show-favorites-button']")
      .waitForElementVisible("[data-test='favorites-sidebar']", 2000)
      .end();
  }
};
