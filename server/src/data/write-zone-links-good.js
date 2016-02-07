const zones = require('./zone-links.json');
const getForecastTextFromUrl = require('../app/process').getForecastTextFromUrl;
const fs = require('fs');
const RSVP = require('rsvp');
const _ = require('lodash');


function writeGoodLinks(goodLinks) {
  fs.writeFile('zone-links-good.json', JSON.stringify(goodLinks), (err) => {
    if (err) throw err;
  });
}

const createPromise = (url, zoneId) => {
  return new RSVP.Promise((resolve, reject) => {
    getForecastTextFromUrl(url).then((json) => {
      console.log(zoneId);
      resolve(zoneId);
    }, (error) => {
      reject();
    });
  });
};

const promises = _.map(zones, (value, key) => { 
  return createPromise(value, key);
});

RSVP.allSettled(promises).then((urls) => {
  console.log(urls);
  const good = urls.reduce((prevReturn, currentResult) => {
    if (currentResult.state === 'fulfilled') {
      prevReturn[currentResult.value] = zones[currentResult.value];
      return prevReturn;
    }
    return prevReturn;
  }, {});
  console.log(good);
  writeGoodLinks(good);
});
